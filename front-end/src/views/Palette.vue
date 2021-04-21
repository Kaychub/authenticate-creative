<template>
    <div class='palette'>
        <div v-if='this.$root.$data.selectedPaletteID != 0'>
          <div v-if='this.selectedPalette'>
            <div class='selected-palette-info'>
              <div class='current-palette'>Currently viewing:</div>
              <div class='selected-name'>{{ selectedPalette.name }}</div>
            </div>
            <div class='swatches-wrapper' v-if='this.swatches.length > 0'>
              <button class='toggle-codes' @click='toggleCodes()'>Turn {{ this.showCodes ? "off" : "on" }} codes</button>
              <div class='swatch' v-for='swatch in this.swatches' :key='swatch._id'>
                <div class='name'>
                  <h1>{{ swatch.name }}</h1>
                </div>
                <div class='color-wrapper'>
                  <div class='color-code-wrapper' v-for='color in swatch.colors' :key='color' :style='{"background-color": color, width: 100/swatch.colors.length + "%"}'>
                    <div class='color-code'>{{ showCodes ? color : ""}}</div>
                  </div>
                </div>
                <!-- <button class='removeButton' @click='removeSwatch(swatch)'>X</button> -->
              </div>
            </div>
            <div v-else>
              <h2>This palette is empty! Your swatches will show up here!</h2>
              <h2><router-link class='router-link' to='/create'>Add swatches here</router-link></h2>
            </div> 
          </div>
        </div>
        <div v-else>
          <h2>It looks like you haven't selected a palette yet!</h2>
          <h2><router-link class='router-link' to='/'>Select a palette here</router-link></h2>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'Palette',
    data: () => { return {
        showCodes: false,
        selectedPalette: null,
        swatches: [],
    }},
  async created() {
    // No palette selected
    this.getSwatches();
  },
  methods: {
    async removeSwatch(swatch) {
      try {
        axios.delete('/api/palettes/' + this.selectedPalette._id + '/swatches/' + swatch._id);
        this.getSwatches();
      } catch (error) {
        console.log(error);
      }
    },
    async getSwatches() {
      if (this.$root.$data.selectedPaletteID == 0) {
        console.log("no palette selected");
        return;
      }
      try {
        const response = await axios.get('/api/palettes/' + this.$root.$data.selectedPaletteID);
        this.selectedPalette = response.data;
        const response2 = await axios.get('/api/palettes/' + this.selectedPalette._id + '/swatches')
        this.swatches = response2.data;
      } catch (error) {
        console.log(error);
      }
    },
    toggleCodes() {
      this.showCodes = !this.showCodes;
    }
  }
}
</script>

<style scoped>
.swatch {
    display: grid;
    margin: 10px 0;
    /* border: 1px solid black; */
    grid-template-columns: 20% 80%;
    grid-template-areas: "name colors";
}

.name {
    grid-area: "name";
    word-wrap: break-word;
    /* width: 400px; */
}

.selected-name {
  font-weight: bold;
}

h1 {
    font-weight: bold;
    font-size: 20px;
}

.color-wrapper {
    grid-area: colors;
    display: flex;
    flex-direction: row;
    width: 100%;
}

.color-code-wrapper {
    width: 100%;
    min-height: 60px;
    display: flex;
    flex-direction: column;
}

.color-code {
    color: white;
    text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
    font-size: 14px;
    letter-spacing: 1px;
    word-wrap: break-word;
}

.color {
    width: 100%;
    height: 100%;
}

.toggle-codes {
    border: 1px solid black;
    min-height: 25px;
    font-size: 15px;
}

.removeButton {
    border: 1px solid black;
    grid-area: button;
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

</style>