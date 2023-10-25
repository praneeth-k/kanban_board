const Constants = {
  DB_CONNECTION_STRING:
    "f9e54bfe970b48c6965d071391dd5b412278e8f22c718de651657b60fd95e148fb799bd3dfeccdc58d5c258a0c1e5fd0cceeb5f6041c925b466d52bd0d5b4edd26d57d68c72a24e3373e1963a1f6ec05856cf48c5de130c31b77a7790649f26df46ccaebdfc569f2e0862258fe8edfa1",
};

enum ReturnType {
  SUCCESS,
  VALIDATION_ERROR,
  NOT_FOUND,
  FAIL,
  NONE,
}

export { Constants, ReturnType };
