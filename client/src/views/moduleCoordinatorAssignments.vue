<template>
<div class="container-fluid row" id="middleContainer">

          <div class="row align-items-center">
            <div class="col">
              <div class="d-grid gap-3 col-5 ">
                <button
                  class="btn btn-lg btn-warning"
                  type="button"
                >
                  Assignments
                </button>
              </div>
            </div>
            <div class="col-10 rounded me-sm-3" id="registerationFormContanier">
              <h2 class="h2 m-3 text-dark">Course: {{state.course.courseName}}</h2>
              <h3 class="h3 m-3 text-dark">Assignments</h3>
              <div class="table-responsive overflow-scroll">
                <table class="table">
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Code</th>
                      <th scope="col">Due Date</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="assignment in state.course.assignments" :key="assignment">
                      <td>{{ assignment.name }}</td>
                      <td>{{ assignment.code }}</td>
                      <td>{{ assignment.dueDate.split("T")[0] }}</td>
                      <td>
                        <button
                          type="button"
                          class="btn btn-primary btn-sm"
                          @click="getAssignment(assignment._id)"
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
    <router-link :to="{ name: 'AddAssignment', params: { courseID: state.course._id } }"
    v-if="state.user.accType === 'Module Coordinator'">
    <button class="btn btn-success float-end m-lg-5">Allocate a new assignment</button>
    </router-link>
        </div>

</template>

<script>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
// import axios from 'axios';

export default {
  props: {
    course: {
      required: true,
      type: String,
    },
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const state = ref({
      user: computed(() => store.state.User.user),
      course: computed(() => {
        if (props.course) { return JSON.parse(props.course); }
        return store.state.Course.course;
      }),
      listOfAssignments: null,
    });
    if (!state.value.course) {
      router.push({ name: 'Home' });
    }
    function getAssignment(assignmentID) {
      // eslint-disable-next-line no-underscore-dangle
      router.push({ name: 'Assignment', params: { assid: assignmentID, cID: state.value.course._id, course: JSON.stringify(state.value.course) } });
    }
    return {
      state,
      getAssignment,
    };
  },
};
</script>

<style scoped>
.table-responsive {
  max-height: 50vh;
}
</style>
