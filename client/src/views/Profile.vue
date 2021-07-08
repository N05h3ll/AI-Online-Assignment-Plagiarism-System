<template>
  <div class="container rounded" id="registerationFormContanier">
      <table v-if="!state.loading" class="table table-bordered">
        <tr>
          <th><h5 class="h5">User Name:  </h5></th>
          <th> <h5 class="h5 fw-bolder">{{state.user.name}}</h5>  </th>
        </tr>
        <tr>
          <td> <h5 class="h5">User ID:  </h5></td>
          <td><h5 class="h5 fw-bolder">{{state.user._id}}</h5></td>
        </tr>
        <tr>
          <td><h5 class="h5">Email:  </h5></td>
          <td><h5 class="h5 fw-bolder">
            {{state.user.email}}</h5></td>
        </tr>
        <tr>
          <td><h5 class="h5">Institution: </h5></td>
          <td><h5 class="h5 fw-bolder">{{state.user.institution}}</h5></td>
       </tr>
       <tr>
          <td><h5 class="h5">Account Type </h5></td>
          <td><h5 class="h5 fw-bolder">{{state.user.accType}}</h5></td>
       </tr>
       <tr v-if="state.user.accType === 'Student' || state.user.accType === 'Teacher Assistant'">
          <td><h5 class="h5">Enrolled Courses: </h5></td>
          <td><h5 class="h5 fw-bolder">{{state.user.enrolledCourses.length}}</h5></td>
       </tr>
       <tr v-if="state.user.accType === 'Module Coordinator'">
          <td><h5 class="h5">Created Courses: </h5></td>
          <td><h5 class="h5 fw-bolder">{{state.user.createdCourses.length}}</h5></td>
       </tr>
        <tr v-if="state.user.accType === 'Module Coordinator'">
          <td><h5 class="h5">Created Assignments: </h5></td>
          <td><h5 class="h5 fw-bolder">{{state.user.assignments.length}}</h5></td>
       </tr>
       <tr v-if="state.user.accType === 'Student'">
          <td><h5 class="h5">Submitted Assignemnts: </h5></td>
          <td><h5 class="h5 fw-bolder">{{state.user.submittedAssignments.length}}</h5></td>
       </tr>
      </table>

</div>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();
    const state = ref({
      user: computed(() => store.state.User.user),
    });

    return {
      state,
    };
  },
};
</script>
