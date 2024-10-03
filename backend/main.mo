import Hash "mo:base/Hash";
import Int "mo:base/Int";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor {
  type SearchHistory = {
    symbol: Text;
    timestamp: Int;
  };

  stable var searchHistoryEntries : [(Text, SearchHistory)] = [];
  let searchHistory = HashMap.fromIter<Text, SearchHistory>(searchHistoryEntries.vals(), 10, Text.equal, Text.hash);

  public func addSearch(symbol: Text) : async () {
    let entry : SearchHistory = {
      symbol = symbol;
      timestamp = Time.now();
    };
    searchHistory.put(symbol, entry);
  };

  public query func getSearchHistory() : async [SearchHistory] {
    Iter.toArray(searchHistory.vals())
  };

  system func preupgrade() {
    searchHistoryEntries := Iter.toArray(searchHistory.entries());
  };

  system func postupgrade() {
    searchHistoryEntries := [];
  };
}
