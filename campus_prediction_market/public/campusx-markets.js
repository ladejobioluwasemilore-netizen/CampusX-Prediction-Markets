// Shared wire format is decimal odds. Market Studio uses independent share prices.
(() => {
  const clean = market => {
    const result = { ...market, id: String(market.id), priceFormat: 'decimal' };
    delete result._manualPriceEditing;
    delete result.trend;
    delete result.trendNo;
    delete result.selection;
    return result;
  };
  const toDecimal = market => {
    const share = market.priceFormat === 'share' || (!market.priceFormat && Number(market.yes) < 1);
    const yes = Number(market.yes ?? market.yes_price), no = Number(market.no ?? market.no_price);
    const status = String(market.status || 'Open').toLowerCase();
    return clean({ ...market, yes: share ? 1 / yes : yes, no: share ? 1 / no : no,
      status: status.charAt(0).toUpperCase() + status.slice(1) });
  };
  const toShare = market => {
    const m = toDecimal(market);
    return { ...m, priceFormat: 'share', yes: 1 / m.yes, no: 1 / m.no, status: m.status.toUpperCase() };
  };
  const changes = (list, previous) => {
    const before = new Map(previous.map(m => [String(m.id), JSON.stringify(toDecimal(m))]));
    const seen = new Set(), rows = [];
    for (const m of list) {
      const data = toDecimal(m), id = String(m.id);
      seen.add(id);
      if (before.get(id) !== JSON.stringify(data)) rows.push({ id, data, deleted: false });
    }
    for (const id of before.keys()) if (!seen.has(id)) rows.push({ id, data: {}, deleted: true });
    return rows;
  };
  globalThis.CampusXMarkets = { toDecimal, toShare, changes };
})();