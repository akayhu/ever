import Votes from "@/views/Votes.vue";

describe("Views Votes.vue", () => {
  // computed hook
  it("has a computed hook", () => {
    expect(typeof Votes.computed).toBe("object");
  });

  // correct default name
  it("sets the correct default name", () => {
    expect(typeof Votes.computed).toBe("object");
    const votesName = Votes.name;
    expect(votesName).toBe("Votes");
  });
});
