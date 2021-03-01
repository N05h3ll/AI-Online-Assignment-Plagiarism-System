<template>
<div class="container-fluid row" id="middleContainer">

          <div class="row align-items-center">
            <div class="col">
              <div class="d-grid gap-3 col-5 ">
                <button
                  class="btn btn-lg btn-warning"
                  type="button"
                >
                  Courses
                </button>
              </div>
            </div>
            <div class="col-10 rounded me-sm-3" id="registerationFormContanier">
              <h2 class="h2 m-3 text-dark">Courses</h2>
              <div class="table-responsive overflow-scroll">
                <table class="table" v-if="state.listOfCourses">
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Code</th>
                      <th scope="col">Enrolled Students</th>
                      <th scope="col">Assignments</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="course in state.listOfCourses" :key="course">
                      <td>{{ course.courseName }}</td>
                      <td>{{ course.courseCode }}</td>
                      <!-- <td>{{ course.enrolledStudents.length }}/
                        {{ course.courseCapacity }}</td> -->
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
          </div>
        </div>
        <div>
    <router-link :to="{ name: 'addCourse' }">
    <button class="btn btn-success float-end m-lg-5">Add new course</button>
    </router-link>
        </div>

</template>

<script>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {

  setup() {
    const router = useRouter();
    const store = useStore();
    const state = ref({
      user: computed(() => store.state.User.user),
      listOfCourses: computed(() => store.state.User.user.createdCourses),
    });
    function addCourse() {
      router.push({ name: 'addCourse' });
    }
    function getCourse(courseID) {
      router.push({ name: 'Course', params: { cID: courseID } });
    }
    console.log(new Date().toLocaleDateString());
    return {
      state,
      addCourse,
      getCourse,
    };
  },
};
</script>

<style scoped>
.table-responsive {
  max-height: 50vh;
}
</style>
