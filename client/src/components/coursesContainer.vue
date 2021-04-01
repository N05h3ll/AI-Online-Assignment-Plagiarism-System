<template>
            <div class="col-10 rounded me-sm-3" id="registerationFormContanier">
              <h2 class="h2 m-3 text-dark">Courses</h2>
              <div class="table-responsive overflow-scroll">
                <table class="table" v-if="state.listOfCourses">
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Code</th>
                      <th scope="col"
                      v-if="state.user.accType === 'Module Coordinator'">Enrolled Students</th>
                      <th scope="col">Assignments</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="course in state.listOfCourses" :key="course">
                      <td>{{ course.courseName }}</td>
                      <td>{{ course.courseCode }}</td>
                      <td v-if="state.user.accType === 'Module Coordinator'">
                        {{ course.enrolledStudents.length }}/
                        {{ course.courseCapacity }}</td>
                      <td>{{ course.assignments.length }}</td>
                      <td>
                        <button
                          type="button"
                          class="btn btn-primary btn-sm"
                          @click="getCourse(course._id)"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

        <div v-if="state.user.accType === 'Module Coordinator'"
        >
    <router-link :to="{ name: 'addCourse' }">
    <button class="btn btn-success float-end m-lg-5">Add new course</button>
    </router-link>
        </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import axios from 'axios';

export default {

  setup() {
    const router = useRouter();
    const store = useStore();
    const state = ref({
      user: computed(() => store.state.User.user),
      listOfCourses: computed(() => {
        if (state.value.user.accType === 'Module Coordinator') {
          return store.state.User.user.createdCourses;
        }
        return store.state.User.user.enrolledCourses;
      }),
      enrolledSuccess: false,
      enrolledFail: false,
    });

    function close() {
      state.value.searchResult = null;
      state.value.searchError = null;
    }

    function addCourse() {
      router.push({ name: 'addCourse' });
    }
    function getCourse(courseID) {
      router.push({ name: 'Course', params: { cID: courseID } });
    }
    function enrollCourse(courseID) {
      axios.post(`http://127.0.0.1:3000/api/course/enroll/${courseID}`).then(async () => {
        state.value.enrolledSuccess = true;
        state.value.enrolledFail = false;
        await setTimeout(() => {
          close();
          state.value.enrolledSuccess = false;
          state.value.enrolledFail = false;
        }, 3000);
      }).catch(async () => {
        state.value.enrolledSuccess = false;
        state.value.enrolledFail = true;
        await setTimeout(() => {
          close();
          state.value.enrolledSuccess = false;
          state.value.enrolledFail = false;
        }, 3000);
      });
    }
    return {
      state,
      addCourse,
      getCourse,
      close,
      enrollCourse,
    };
  },
};
</script>

<style scoped>
.table-responsive {
  max-height: 50vh;
}
</style>
