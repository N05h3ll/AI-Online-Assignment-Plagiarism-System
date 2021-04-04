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
<coursesContainer/>
          </div>
    </div>
</template>

<script>
import coursesContainer from './coursesContainer.vue';

export default {
  components: {
    coursesContainer,
  },
};
</script>

<style scoped>
.table-responsive {
  max-height: 50vh;
}
</style>
