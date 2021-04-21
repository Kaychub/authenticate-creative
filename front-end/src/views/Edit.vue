<template>
  <div>
    <div class='selected-palette-info' v-if='selectedPalette'>
    <div class='current-palette'>Editing:</div>
    <div class='name'>{{ selectedPalette.name }}</div>
  </div>
    <div class='wrapper' v-if='this.$root.$data.selectedPaletteID != 0'>
      <div v-if='swatch'>
        <EditComp :paletteID="this.paletteID" :swatch="this.swatch" />
        <button class='return' @click='goBack()'>Return</button>
      </div>
      <!-- Select a swatch from palette -->
      <div v-else class='swatches'>
        <div class='swatch' v-for='swatch in this.swatches' :key='swatch._id'>
          <div class='swatch-name'>{{ swatch.name }}</div>
          <div class='buttons'>
            <button @click='editSwatch(swatch)'>Edit</button>
            <button @click='removeSwatch(swatch)'>Delete</button>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <h2>It looks like you haven't selected a palette yet!</h2>
      <h2><router-link class="router-link" to='/'>Select a palette here</router-link></h2>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import EditComp from '../components/Edit.vue';
export default {
  name: 'Edit',
  data: () => { return {
    paletteID: '0',
    selectedPalette: null,
    swatch: null,
    swatches: [],
  }},
  components: {
    EditComp
  },
  async created() {
    if (this.$root.$data.selectedPaletteID == 0) {
      return;
    }
    const response = await axios.get('/api/palettes/' + this.$root.$data.selectedPaletteID);
    this.selectedPalette = response.data;
    await this.getSwatches();
    },
  methods: {
    editSwatch(swatch) {
      this.swatch = swatch;
    },
    async removeSwatch(swatch) {
      try {
        await axios.delete('/api/palettes/' + this.paletteID + '/swatches/' + swatch._id);
        this.getSwatches();
      } catch (error) {
        console.log(error);
      }
    },
    async goBack() {
      this.swatch = null;
      await this.getSwatches();
    },
    async getSwatches() {
      this.paletteID = this.$root.$data.selectedPaletteID.toString();
      if (this.paletteID == 0) {
        console.log("No palette");
        return;
      }
      try {
        const response = await axios.get('/api/palettes/' + this.paletteID + '/swatches');
        this.swatches = response.data;
      } catch (error) {
        console.log(error);
      }
    }
  },
}
</script>

<style scoped>

.name {
  font-weight: bold;
}

.return {
  margin-top: 5px;
  width: 70%;
  max-width: 800px;
  padding: 5px;
  border: solid black;
  font-size: 18px;
}

.selected-palette-info {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  /* width: 70%; */
  max-width: 400px;
  padding: 5px 0;

  margin: auto;
  margin-bottom: 10px;

  border: 1px solid black;

  border-radius: 10px;
  font-size: 18px;
}

.swatches {
  max-width: 800px;
  margin: auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;

  font-size: 20px;
}

.swatch {
  display: flex;
  flex-direction: column;

  min-width: 120px;

  border: 1px black solid;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;

  margin: 10px;
}

.swatch-name {
  padding: 5px 10px;
}

.buttons {
  width: 100%;
}

.buttons button {
  width: 50%;
}

</style>