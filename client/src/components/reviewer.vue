<template>
<!-- eslint-disable max-len -->
  <div class="container-fluid" id="middleContainer">
    <div class="rounded align-content-center justify-content-center text-center" id="registerationFormContanier">
      <h2 class="h2 text-dark">Submitted Documents</h2>
      <div class="table-responsive overflow-scroll" style="height: 40rem;">
                <!-- Reports TABLE -->
                <table class="table">
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Code</th>
                      <th scope="col">Note</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="report in state.user.reports" :key="report">
                      <td>{{report.assignmentName}}</td>
                      <td>{{report.assignmentCode}}</td>
                      <td v-if="report.status !== 'Second Trial'"></td>
                      <td v-if="report.status === 'Second Trial'" class="badge bg-warning text-dark">Old Report, Second Trial Allowd</td>
                      <td>
                        <button
                          type="button"
                          class="btn btn-primary btn-sm"
                          @click="getReport(report._id)"
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
</template>

<script>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  props: {
    user: {
      required: true,
      type: Object,
    },
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const state = ref({
      user: computed(() => {
        if (props.user) { return props.user; }
        return store.state.User.user;
      }),
    });
    function getReport(repID) {
      router.push({ name: 'Report', params: { repid: repID } });
    }
    return {
      state,
      getReport,
    };
  },
};
</script>

<style scoped>
.table-responsive {
  max-height: 60vh;
}
</style>
