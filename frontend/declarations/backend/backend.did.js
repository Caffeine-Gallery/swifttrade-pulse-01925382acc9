export const idlFactory = ({ IDL }) => {
  const SearchHistory = IDL.Record({
    'timestamp' : IDL.Int,
    'symbol' : IDL.Text,
  });
  return IDL.Service({
    'addSearch' : IDL.Func([IDL.Text], [], []),
    'getSearchHistory' : IDL.Func([], [IDL.Vec(SearchHistory)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
