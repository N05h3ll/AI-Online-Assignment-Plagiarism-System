<template>
  <div class="float-end me-sm-3">
    <div class="input-group mb-3">
      <input
        type="text"
        class="form-control"
        placeholder="Percentage Filter %"
        aria-label="Assigment"
        aria-describedby="basic-addon1"
        v-model="state.filterCounter"
      />
    </div>
  </div>
  <div class="container" id="middleContainer" v-if="state.Report.data">
    <div class="row" id="registerationFormContanier">
      <div class="col-lg-8 me-sm-3 align-self-center">
        <h2 style="color: rgb(0, 0, 0);">OAPS REPORT</h2>
        <h4
        style="color: rgb(0, 0, 0);"
        >Plagirism Percentage: {{ state.Report.data.totalPercentage.$numberDecimal }} %
        </h4>
        <table border="1" class="m-3">
          <thead>
            <tr>
              <th scope="col">Date:</th>
              <td>{{ state.Report.data.uploadDate }}</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Author</th>
              <td>{{ state.Report.data.author }}</td>
            </tr>
            <tr>
              <th scope="row">File Name</th>
              <td>{{ state.Report.data.fileName }}</td>
            </tr>
            <tr>
              <th scope="row" class="text-primary" v-if="state.Report.data.isSecondTrial">
                Second Trail
              </th>
            </tr>
          </tbody>
        </table>
        <p v-for="index in state.Report.data.baseParagraph" :key="index" class="inlineDisplay">
          <span
            v-if="index.active && index.percentage.$numberDecimal >= 0 &&
            ((index.percentage.$numberDecimal - 0.5) / 0.5) * 100 >
            state.filterCounter"
            style="background-color:#FFF000"
            >{{ index.baseSentence + " " }}</span
          >
          <span v-if="!index.active">{{ index.baseSentence + " " }}</span>
        </p>
      </div>
      <div class="col rounded me-sm-3">
          <button class="btn btn-primary mt-sm-1" @click="sendReport">Send report via email</button>
          <div class="label mt-5"> <h3> filter results </h3> </div>
         <div class="filterContainer mt-1">
          <div id="container" class="m-2">
            <div id="results ">
              <ul>
                <li v-for="sent in filterList" :key="sent"> {{sent.baseSentence}}
                  {{ ((sent.percentage.$numberDecimal - 0.5) / 0.5) * 100 }} %</li>
              </ul>
            </div>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { computed, ref, watch } from 'vue';

const Report = computed(() => useStore().state.Report.report);
export default {
  setup() {
    // eslint-disable-next-line no-unused-vars
    // const store = useStore();
    const store = useStore();
    const route = useRoute();
    axios.get(`http://127.0.0.1:3000/api/report/getreport/${route.params.repid}`).then((report) => {
      store.dispatch('Report/setReport', report);
    });
    const state = ref({
      Report,
      filterCounter: null,
    });
    console.log(state.value.Report);
    // eslint-disable-next-line max-len
    console.log((((state.value.Report.data.baseParagraph[0].percentage.$numberDecimal - 0.5) / 0.5) * 100));
    const filterList = computed(
      () => state.value.Report.data.baseParagraph.filter(
        // eslint-disable-next-line max-len
        (i) => {
          if (i.percentage.$numberDecimal > 0) {
            if (((i.percentage.$numberDecimal - 0.5) / 0.5) * 100 <= state.value.filterCounter) {
              return true;
            } return false;
          } return false;
        },
      ),
    );
    watch(state.value.filterCounter, (newValue) => {
      state.value.filterCounter = newValue;
    });
    function sendReport() {
      // eslint-disable-next-line no-underscore-dangle
      axios.get(`http://127.0.0.1:3000/api/report/emailreport/${state.value.Report.data._id}`);
    }
    return {
      state,
      filterList,
      sendReport,
    };
  },
};
</script>
<style>
.inlineDisplay {
  display: inline;
}
.filterContainer {
  border: 1px solid black;
}
</style>
