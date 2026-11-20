// CampusX accounts backend: Supabase email/password auth + profiles.
// Loaded as a module on every page after campusx-config.js.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const SESSION_KEY = 'campusXSession';
const REMEMBER_KEY = 'campusXRememberedSession';
const REMEMBER_FLAG = 'campusXRememberMe';
const cfg = window.CAMPUSX_SUPABASE;

// Keep the login in localStorage only when "Remember me" was ticked; otherwise sessionStorage.
const authStorage = {
  getItem: k => sessionStorage.getItem(k) ?? localStorage.getItem(k),
  setItem: (k, v) => {
    if (localStorage.getItem(REMEMBER_FLAG) === '1') { localStorage.setItem(k, v); sessionStorage.removeItem(k); }
    else { sessionStorage.setItem(k, v); localStorage.removeItem(k); }
  },
  removeItem: k => { sessionStorage.removeItem(k); localStorage.removeItem(k); },
};

const unavailable = () => { throw new Error('Accounts are not connected yet. Please try again shortly.'); };
const sb = cfg ? createClient(cfg.url, cfg.key, { auth: { storage: authStorage, persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }) : null;

function friendly(error) {
  const m = String(error?.message || error || '');
  if (/invalid login credentials/i.test(m)) return 'Incorrect email or password.';
  if (/email not confirmed/i.test(m)) return 'Please confirm your email address first. Check your inbox for the confirmation link.';
  if (/already registered|already been registered/i.test(m)) return 'An account with this email already exists. Switch to Sign in.';
  if (/password/i.test(m) && /(weak|short|least)/i.test(m)) return 'Use a stronger password with at least 8 characters.';
  if (/rate limit|too many/i.test(m)) return 'Too many attempts. Please wait a minute and try again.';
  return m || 'Something went wrong. Please try again.';
}
const fail = e => { throw new Error(friendly(e)); };

function toUser(p, roles) {
  const isAdmin = roles.includes('admin');
  return {
    id: p.id, name: p.full_name || (p.email || '').split('@')[0], email: p.email,
    phone: p.phone || '', campus: p.campus || '', department: p.department || '', level: p.level || '',
    status: p.status, role: isAdmin ? 'ADMIN' : 'TRADER', adminUserId: isAdmin ? p.admin_user_id : null,
    adminVerified: isAdmin, provider: 'password', createdAt: p.created_at,
  };
}
function cache(user) {
  if (!user) { sessionStorage.removeItem(SESSION_KEY); localStorage.removeItem(REMEMBER_KEY); return; }
  const json = JSON.stringify(user);
  sessionStorage.setItem(SESSION_KEY, json);
  if (localStorage.getItem(REMEMBER_FLAG) === '1') localStorage.setItem(REMEMBER_KEY, json); else localStorage.removeItem(REMEMBER_KEY);
  localStorage.setItem('campusXUserProfile', json);
}
async function loadProfile(uid) {
  const [{ data: p, error }, { data: r }] = await Promise.all([
    sb.from('profiles').select('*').eq('id', uid).maybeSingle(),
    sb.from('user_roles').select('role').eq('user_id', uid),
  ]);
  if (error) fail(error);
  if (!p) throw new Error('Your profile could not be found. Please contact support.');
  return toUser(p, (r || []).map(x => x.role));
}

const api = sb ? {
  async signUp({ name, email, password, remember }) {
    localStorage.setItem(REMEMBER_FLAG, remember ? '1' : '0');
    const { data, error } = await sb.auth.signUp({
      email, password,
      options: { data: { full_name: name }, emailRedirectTo: `${location.origin}/campusx/index.html` },
    });
    if (error) fail(error);
    // Supabase hides duplicate signups by returning a user with no identities.
    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) fail('already registered');
    if (!data.session) return { needsConfirmation: true };
    const user = await loadProfile(data.user.id);
    await sb.rpc('record_login');
    cache(user);
    return { user };
  },
  async signIn({ email, password, remember }) {
    localStorage.setItem(REMEMBER_FLAG, remember ? '1' : '0');
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) fail(error);
    const user = await loadProfile(data.user.id);
    if (user.status === 'SUSPENDED') { await sb.auth.signOut(); cache(null); throw new Error('This account is currently deactivated.'); }
    await sb.rpc('record_login');
    cache(user);
    return user;
  },
  async signOut() { await sb.auth.signOut(); cache(null); },
  async currentUser() {
    const { data: { user: authUser } } = await sb.auth.getUser();
    if (!authUser) { cache(null); return null; }
    const user = await loadProfile(authUser.id);
    if (user.status === 'SUSPENDED') { await sb.auth.signOut(); cache(null); return null; }
    cache(user);
    return user;
  },
  async updateProfile(fields) {
    const { data: { user: authUser } } = await sb.auth.getUser();
    if (!authUser) throw new Error('Please sign in again.');
    const patch = {};
    for (const k of ['full_name', 'phone', 'campus', 'department', 'level']) if (k in fields) patch[k] = String(fields[k] ?? '').trim().slice(0, 200) || null;
    if ('full_name' in patch && !patch.full_name) throw new Error('Enter your full name.');
    const { error } = await sb.from('profiles').update(patch).eq('id', authUser.id);
    if (error) fail(error);
    const user = await loadProfile(authUser.id);
    cache(user);
    return user;
  },
  async adminListUsers() {
    const [{ data: profiles, error }, { data: roles, error: e2 }] = await Promise.all([
      sb.from('profiles').select('*').order('created_at', { ascending: false }),
      sb.from('user_roles').select('user_id, role'),
    ]);
    if (error || e2) fail(error || e2);
    return profiles.map(p => toUser(p, (roles || []).filter(r => r.user_id === p.id).map(r => r.role)));
  },
  async adminSetStatus(id, status) {
    const { error } = await sb.rpc('admin_set_user_status', { target: id, new_status: status });
    if (error) fail(error);
  },
  async adminDeleteUser(id) {
    const { error } = await sb.rpc('admin_delete_user', { target: id });
    if (error) fail(error);
  },
  client: sb,
} : new Proxy({}, { get: (_t, prop) => (prop === 'then' ? undefined : unavailable) });

window.CampusXBackend = api;
if (window.__cxResolveBackend) window.__cxResolveBackend(api);
else window.CampusXBackendReady = Promise.resolve(api);

// Keep the cached account in sync with the real session on each page.
if (sb) {
  const page = location.pathname.split('/').pop() || 'index.html';
  const hadCache = !!(sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(REMEMBER_KEY));
  api.currentUser().then(user => {
    if (page.startsWith('dashboard')) {
      if (!user) { location.replace('index.html'); return; }
      window.CampusXRefreshUser?.(user);
    } else if (page.startsWith('admin')) {
      window.CampusXAdminStart?.(user);
    } else if (user && !hadCache) {
      // Arrived from the email confirmation link: go straight to the dashboard.
      location.href = 'dashboard.html';
    } else if (!user && hadCache) {
      window.CampusXSignedOut?.();
    }
  }).catch(err => console.error('CampusX session check failed:', err));
}
