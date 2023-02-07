import About from "@/views/About.vue";

describe("Views About.vue", () => {
  // name hook
  it("has a computed hook", () => {
    expect(typeof About.name).toBe("string");
  });
});
