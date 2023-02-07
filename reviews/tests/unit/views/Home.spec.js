// import { mount } from "@vue/test-utils";
import Home from "@/views/Home.vue";

describe("Views Home.vue", () => {
  // data hook
  it("has a data hook", () => {
    expect(typeof Home.data).toBe("function");
  });

  // correct default data
  it("sets the correct default data", () => {
    expect(typeof Home.data).toBe("function");
    const homeData = Home.data();
    expect(homeData.listTab).toBe("leaderboard");
  });

  // it("sets the correct default methods", () => {
  //   expect(typeof Home.methods).toBe("object");
  //   const wrapper = mount(Home);
  //   wrapper.setData({ listTab: "reviews" });
  //   expect(wrapper.vm.listTab).toBe("reviews");
  // });
});
