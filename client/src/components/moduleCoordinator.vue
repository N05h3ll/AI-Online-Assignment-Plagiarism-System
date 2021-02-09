<template>
<div class="container row" id="middleContainer">
      <div class="row">
        <div class="container">
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
            <div class="col rounded me-sm-3" id="registerationFormContanier">
              <h2 class="h2 m-3 text-dark">Assignments</h2>
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
                    <tr v-for="assignment in state.listOfAssignments" :key="assignment">
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
    <router-link :to="{ name: 'AddAssignment' }">
    <button class="btn btn-success float-end m-lg-5">Allocate a new assignment</button>
    </router-link>
        </div>
      </div>
    </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  props: {
    user: {
      required: true,
      type: Object,
    },
    listOfAssignments: {
      required: true,
      type: Array,
    },
  },
  setup(props) {
    const router = useRouter();
    const state = ref({
      user: computed(() => props.user),
      listOfAssignments: computed(() => props.listOfAssignments),
    });
    function getAssignment(assignmentID) {
      // console.log(assignmentID);
      router.push({ name: 'Assignment', params: { assid: assignmentID } });
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
