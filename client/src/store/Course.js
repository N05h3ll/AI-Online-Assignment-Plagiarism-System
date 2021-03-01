/* eslint-disable import/prefer-default-export */
export const CourseModule = {
  namespaced: true,

  state: {
    course: null,
  },

  // Mutations are functions that effect the STATE.
  mutations: {
    SET_COURSE(state, course) {
      state.course = course;
    },
  },

  // Actions are functions that you call throughout your application that call mutations.
  actions: {
    setCourse({ commit }, course) {
      commit('SET_COURSE', course);
    },
  },
};
