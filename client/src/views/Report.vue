<template>
<!-- eslint-disable max-len  -->
<div class="d-flex justify-content-center spinner"
v-if="state.loading">
<div class="align-self-center h1">
    Loading ...</div>
</div>
<div class="d-flex justify-content-center spinner"
v-if="state.showSources">
<div class="align-self-center h1">
    {{state.counts}}
    </div>
</div>
  <div class="float-end me-sm-3 mt-1" v-if="!state.loading">
    <div class="input-group mb-3 rounded">
            <span class="input-group-text" id="basic-addon1">Choose filter percentage:</span>
             <select class="form-control" placeholder="Percentage"
             aria-label="Username" aria-describedby="basic-addon1" maxlength="10" v-model="state.filterCounter">
                <option value="0" selected>0%</option>
                <option value="10">10%</option>
                <option value="20">20%</option>
                <option value="30">30%</option>
                <option value="40">40%</option>
                <option value="50">50%</option>
                <option value="60">60%</option>
                <option value="70">70%</option>
                <option value="80">80%</option>
                <option value="90">90%</option>
                <option value="100">100%</option>
               </select>
          </div>
  </div>
  <div class="container" id="middleContainer" v-if="state.Report.data && !state.loading">
    <div class="row" id="registerationFormContanier">
        <h1 class="text-center" style="color: #000000">OAPS REPORT</h1>
      <div class="col-lg-8 me-sm-3 align-self-center" id="plagReport">
        <h3
        style="color: rgb(0, 0, 0);"
        >Plagirism Percentage: <strong v-if="filterList.length === 0">
          {{ state.Report.data.totalPercentage.$numberDecimal.slice(0,5) }} %</strong>
           <strong v-if="filterList.length !== 0">
          {{ Math.round(state.Report.data.totalPercentage.$numberDecimal - (100 - (((state.Report.data.baseParagraph.length - filterList.length)/state.Report.data.baseParagraph.length)*100))) }} %</strong>
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
          <span class=""
          v-if="index.active && index.percentage.$numberDecimal >= 0 &&
            ((index.percentage.$numberDecimal - 0.5) / 0.5) * 100 >
            state.filterCounter">
            <a v-if="state.invisible !== 'invisible'" style="background-color:#e66a6a" class="text-dark"
             id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                      {{ index.baseSentence + " " }}
            </a>
            <a v-if="state.invisible === 'invisible'" style="color:#e66a6a" class="text-danger"
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
                <button
              type="button"
              v-bind:class="'btn btn-primary mt-sm-1 mx-sm-1 '+state.invisible"
              @click="genPDF('middleContainer', 'Plagiarism report')"
            >
              Print Report
            </button>
          <button v-bind:class="'btn btn-primary mt-sm-1 '+state.invisible" @click="sendReport">Send report via email</button>
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
/* eslint-disable prefer-const */
// eslint-disable no-restricted-syntax
import axios from 'axios';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { computed, ref, watch } from 'vue';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const Report = computed(() => useStore().state.Report.singleReport);
export default {
  setup() {
    // eslint-disable-next-line no-unused-vars
    // const store = useStore();
    // eslint-disable-next-line global-require
    const img = require('./img.js');
    const store = useStore();
    const route = useRoute();
    const state = ref({
      user: computed(() => store.state.User.user),
      Report,
      filterCounter: null,
      loading: true,
      readmore: false,
      showSources: false,
      sources: null,
      counts: null,
    });
    axios.get(`${process.env.VUE_APP_BACKENDURL}/api/report/getreport/${route.params.repid}`).then((report) => {
      // eslint-disable-next-line no-var
      var sources = report.data.baseParagraph.map((x) => x.url);
      // eslint-disable-next-line no-var
      var counts = {};
      // eslint-disable-next-line no-var
      var src = [];
      sources = sources.filter((x) => x !== 'URL');
      sources.forEach((x) => { counts[x] = (counts[x] || 0) + 1; });
      store.dispatch('Report/setReport', report);
      state.value.sources = sources;
      state.value.counts = src;
      state.value.loading = false;
    });
    console.log(state.value.Report);
    // eslint-disable-next-line max-len
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
      axios.get(`${process.env.VUE_APP_BACKENDURL}/api/report/emailreport/${state.value.Report.data._id}`);
    }
    function sleep(milliseconds) {
      const date = Date.now();
      let currentDate = null;
      do {
        currentDate = Date.now();
      } while (currentDate - date < milliseconds);
    }
    function dsble() {
      state.value.invisible = 'invisible';
      sleep(2000);
    }
    async function genPDF(bodyID, text) {
      state.value.readmore = true;
      await dsble();
      window.scrollTo(0, 0);
      if (state.value.invisible) {
        html2canvas(document.getElementById(bodyID)).then((canvas) => {
          // eslint-disable-next-line new-cap
          let doc = new jsPDF();
          let imgData = canvas.toDataURL('image/png');
          let imgWidth = 208;
          let imgHeight = (canvas.height * imgWidth) / canvas.width;
          doc.addImage(img, 'PNG', 5, 5, 20, 15);
          doc.setFontSize(15);
          doc.text(text, 105, 30, 'center');
          doc.addImage(imgData, 'JPEG', 2, 37, imgWidth, imgHeight);
          doc.save(`${Date.now()}report.pdf`);
        });
        // eslint-disable-next-line max-len
        window.scrollTo(0, document.body.scrollHeight * 1.5 || document.documentElement.scrollHeight * 1.5);
        state.value.invisible = null;
        state.value.readmore = false;
      }
    }
    return {
      state,
      filterList,
      sendReport,
      toggleReadMore,
      genPDF,
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
