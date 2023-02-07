import Reviews from "@/views/Reviews.vue";

describe("Views Reviews.vue", () => {
  // computed hook
  it("has a computed hook", () => {
    expect(typeof Reviews.computed).toBe("object");
  });

  // correct default name
  it("sets the correct default name", () => {
    expect(typeof Reviews.computed).toBe("object");
    const reviewsName = Reviews.name;
    expect(reviewsName).toBe("Reviews");
  });
});
