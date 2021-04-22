<template>
<div class='content'>
  <div class='form' v-if='this.$root.$data.user'>
    <input type='text' v-model='name' placeholder='Palette name' />
    <div class='buttons'>
      <!-- <button :class='{favorited: this.isFavorite}' @click='isFavorite = !isFavorite'>&#10084;</button> -->
      <button @click='submitPalette()'>Add palette</button>
    </div>
  </div>
  <div v-else>
    <h2>Logged in users can create their own palettes!</h2>
  </div>
  <div class='palettes'>
    <div v-if='this.$root.$data.user'>
      <h2 v-if='this.userPalettes.length > 0'>Your personal collection</h2>
      <h2 v-else>Create a palette above</h2>
    </div>
    <div class='user-palettes'>
      <div class='palette' v-for='palette in userPalettes' :key='palette._id' :class='{selected : selectedP == palette._id}'>
        <div class='heart-select'>
          <!-- <button :class='{favorited: palette.isFavorite}' @click='toggleFavorite(palette)'>&#10084;</button> -->
          <button class='select-button' @click='selectP(palette)'>Select</button> 
        </div>
        <input class='palette-name' v-model='palette.name' type='text'>
        <div class='creation-date'>Created on {{ palette.creationDate.slice(0, 10) }}</div>
        <div class='rename-x'>
          <button @click='renamePalette(palette)'>Rename</button>
          <button @click='deletePalette(palette._id)'>X</button>
        </div>
      </div>
    </div>
    <h2 v-if='this.otherPalettes.length > 0'>Also check out what others have made</h2>
    <div class='other-palettes'>
      <div class='palette' v-for='palette in otherPalettes' :key='palette._id' :class='{selected : selectedP == palette._id}'>
        <div class='heart-select'>
          <button class='select-button' @click='selectP(palette)'>Select</button> 
        </div>
        <p class='palette-name'>{{ palette.name }}</p>
        <div class='creation-date'>Created on {{ palette.creationDate.slice(0, 10) }}</div>
        <div class='created-by'>Created by {{ palette.user.displayName }}</div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SelectPalette',
  data: () => { return {
    userPalettes: [],
    otherPalettes: [],
    selectedP: 0,
    name: '',
    // isFavorite: false,
  }},
  created() {
    this.getPalettes();
    this.selectedP = this.$root.$data.selectedPaletteID;
  },
  computed: {
  },
  methods: {
    async selectP(palette) {
      this.$root.$data.selectedPaletteID = palette._id;
      this.$root.$data.selectedPaletteUserID = palette.user._id;
      this.selectedP = palette._id;
    },
    // async toggleFavorite(palette) {
    //   try {
    //     await axios.put('/api/palettes/' + palette._id, {
    //       name: palette.name,
    //       creationDate: palette.creationDate,
    //       isFavorite: !palette.isFavorite,
    //     });
    //     this.getPalettes();
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },
    async renamePalette(palette) {
      try {
        await axios.put('/api/palettes/' + palette._id, {
          name: palette.name,
          creationDate: palette.creationDate,
          // isFavorite: palette.isFavorite,
        });
        this.getPalettes();
      } catch (error) {
        console.log(error);
      }
    },
    async submitPalette() {
      if (!this.name) {
        console.log("Name needed");
        return;
      }
      try {
        let d = new Date();
        d = d.toLocaleDateString();
        await axios.post('/api/palettes', {
          name: this.name,
          // isFavorite: this.isFavorite,
          creationDate: d,
        });
        this.name = '';
        // this.isFavorite = false;
        this.getPalettes()
      } catch (error) {
        console.log(error);
      }
    },
    async getPalettes() {
      try {
        const response = await axios.get('/api/palettes');
        let allPalettes = response.data;
        /* // Put favorites first, then append the rest
        let favorites = allPalettes.filter(el => el.isFavorite);
        let nonfavorites = allPalettes.filter(el => !el.isFavorite);
        this.palettes = favorites.concat(nonfavorites);
        this.selected = this.$root.$data.selectedPaletteID; */
        // Put user's palettes first, then append the rest
        if (this.$root.$data.user) {
          this.userPalettes = allPalettes.filter(el => el.user._id == this.$root.$data.user._id);
          this.otherPalettes = allPalettes.filter(el => el.user._id != this.$root.$data.user._id);
        } else {
          this.otherPalettes = allPalettes;
        }
        this.selected = this.$root.$data.selectedPaletteID;
      } catch (error) {
        console.log(error);
      }
    },
    async deletePalette(paletteID) {
      try {
        await axios.delete('/api/palettes/' + paletteID);
        if (paletteID === this.$root.$data.selectedPaletteID) {
          this.$root.$data.selectedPaletteID = 0;
          this.selectedP = 0;
        }
        // console.log(response);
        this.getPalettes();
      } catch (error) {
        console.log(error);
      }
    }
  }
}

</script>

<style scoped>

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form {
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;

  border: 1px solid black;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;

  max-width: 800px;
}

.form input {
  border: none;
  margin-bottom: 2px;
  padding: 8px 0;
  text-align: center;
  font-weight: bold;
  font-size: 20px;
  width: 95%;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.form input:focus {
  outline: none;
}

.form button {
  height: 30px;
  font-size: 18px;
}

input {
  text-align: center;
}

.palette input {
  margin: auto;
  width: 90%;
}

.heart-select {
  margin-bottom: 15px;
}

.select-button {
  width: 100%;
}

.rename-x {
  margin-top: 8px;
  display: grid;
  grid-template-columns: 79% 20%;
  grid-gap: 1%;
}

/* .buttons {
  display: grid;
  grid-template-columns: 50% 50%;
} */

.buttons button {
  width: 100%;
}

.selected {
  padding: 5px;
  border-radius: 3px;
  border: 4px solid #1099B9 !important;
}

.palette {
  max-width: 90%;
  display: flex;
  flex-direction: column;

  margin: 10px;

  border: 1px solid black;
}

.palettes {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.user-palettes {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.other-palettes {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.other-palettes .creation-date {
  padding: 10px;
}

/* .favorited {
  color: red !important;
} */

.creation-date {
  text-align: center;
  margin: auto;
  font-size: 12px;
}

.palette-name {
  font-size: 20px;
}

</style>