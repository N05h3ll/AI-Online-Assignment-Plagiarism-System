<template>
<div class="d-flex justify-content-center spinner"
v-if="state.loading">
<div class="align-self-center h1">
    Loading ...</div>
</div>
  <div class="float-end me-sm-3" v-if="!state.loading">
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
  <div class="container" id="middleContainer" v-if="state.Report.data && !state.loading">
    <div class="row" id="registerationFormContanier">
        <h1 class="text-center" style="color: #000000">OAPS REPORT</h1>
      <div class="col-lg-8 me-sm-3 align-self-center">
        <h3
        style="color: rgb(0, 0, 0);"
        >Plagirism Percentage: <strong>
          {{ state.Report.data.totalPercentage.$numberDecimal.slice(0,5) }} %</strong>
        </h3>
       <table border="2" class="m-3 mb-3" style="width: 80%;">
          <thead>
            <tr>
              <th scope="row">Author:</th>
              <td class="h3">{{ state.Report.data.author }}</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="col">Date:</th>
              <td class="h4">{{ state.Report.data.uploadDate }}</td>
            </tr>
            <tr>
              <th scope="row">File Name:</th>
              <td class="h5">{{ state.Report.data.fileName }}</td>
            </tr>
            <tr>
              <th scope="row"
              style="color: #FF0000;" v-if="state.Report.data.isSecondTrial">
                Second Trail
              </th>
              <td> </td>
            </tr>
          </tbody>
        </table>
        <p v-for="index in state.Report.data.baseParagraph" :key="index" class="inlineDisplay">
          <span class="dropdown"
          v-if="index.active && index.percentage.$numberDecimal >= 0 &&
            ((index.percentage.$numberDecimal - 0.5) / 0.5) * 100 >
            state.filterCounter">
            <a href="#" style="background-color:#e66a6a" class="text-dark"
             id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                      {{ index.baseSentence + " " }}
            </a>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
              <li><a class="dropdown-item" v-bind:href='index.url'>{{ index.url }}</a></li>
            </ul>
          </span>

          <span v-if="!index.active">{{ index.baseSentence + " " }}</span>
        </p>
      </div>
      <div class="col rounded me-sm-3">
          <button class="btn btn-primary mt-sm-1" @click="sendReport">Send report via email</button>
          <div class="label mt-5"> <h3> Filter Results </h3> </div>
         <div class="filterContainer mt-1">
          <div id="container" class="m-2">
            <div id="results ">
              <ul>
                <li v-for="sent in filterList" :key="sent">
                  <span v-if="state.readmore">{{sent.baseSentence}}
                    <a class="text-primary"
                    v-if="state.readmore" @click="toggleReadMore">Read less...</a>
                  </span>
                <span v-if="!state.readmore">{{sent.baseSentence.slice(0,50)}}
                  <a class="text-primary"
                  v-if="!state.readmore" @click="toggleReadMore">Read More...</a></span>
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

const Report = computed(() => useStore().state.Report.singleReport);
export default {
  setup() {
    // eslint-disable-next-line no-unused-vars
    // const store = useStore();
    const store = useStore();
    const route = useRoute();
    const state = ref({
      Report,
      filterCounter: null,
      loading: true,
      readmore: false,
    });
    axios.get(`http://127.0.0.1:3000/api/report/getreport/${route.params.repid}`).then((report) => {
      store.dispatch('Report/setReport', report);
      state.value.loading = false;
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
    function toggleReadMore() {
      state.value.readmore = !state.value.readmore;
    }
    function sendReport() {
      // eslint-disable-next-line no-underscore-dangle
      axios.get(`http://127.0.0.1:3000/api/report/emailreport/${state.value.Report.data._id}`);
    }
    return {
      state,
      filterList,
      sendReport,
      toggleReadMore,
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
