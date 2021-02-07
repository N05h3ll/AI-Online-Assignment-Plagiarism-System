<template>
<div class="container rounded" id="registerationFormContanier">
      <table>
        <tr>
          <th><h5 class="h5">Assignment Name:  </h5></th>
          <th> <h5 class="h5">{{state.Assignment.data.name}}</h5>  </th>
        </tr>
        <tr>
          <td> <h5 class="h5">Assignment Code:  </h5></td>
          <td><h5 class="h5">{{state.Assignment.data.code}}</h5></td>
        </tr>
        <tr>
          <td><h5 class="h5">Assignment Due Date:  </h5></td>
          <td><h5 class="ms-3 h5">{{state.Assignment.data.dueDate.split("T")[0]}}</h5></td>
        </tr>
        <tr>
          <td><h5 class="h5">Author: </h5></td>
          <td><h5 class="h5">{{state.Assignment.data.authorName}}</h5></td>
       </tr>
      </table>
      <hr>
      <hr>
    <div v-html="state.Assignment.data.description" class="fs-5"></div>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { ref, computed } from 'vue';

const Assignment = computed(() => useStore().state.Assignment.singleAssignment);
export default {
  setup() {
    const store = useStore();
    const route = useRoute();
    axios.get(`http://127.0.0.1:3000/api/assignment/getassignment/${route.params.assid}`).then((assignment) => {
      store.dispatch('Assignment/setAssignment', assignment);
    });
    const state = ref({
      Assignment,
    });

    return {
      state,
    };
  },
};
</script>
