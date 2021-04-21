<template>
<div>
  <div class='selected-palette-info' v-if='selectedPalette'>
    <div class='current-palette'>Adding to:</div>
    <div class='name'>{{ selectedPalette.name }}</div>
  </div>
  <div v-if='this.$root.$data.selectedPaletteID != 0'>
    <div :class='badName ? "badName content" : "content"' v-if='selectedPalette'>
      <input type='text' placeholder='Swatch name here' :class='badName ? "badName" : "normalName"' id='inputName' v-model='name' />
      <div class='color-row' v-for='color in this.colors' :key='color.id'>
        <textarea class='color-name' maxlength='7' wrap='soft' v-model='color.color' :class='color.badName ? "badName" : "normalName"' placeholder='#1099b9' />
        <div class='color' :style='{"background-color": color.color}'></div>
        <button class='removeButton' @click='removeColor(color)'>X</button>
      </div>
      <div class='button-container'>
        <button id='addButton' @click='addColor'>Add Color</button>
        <button @click='addSwatch'>Add to Palette</button>
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
    name: 'CreateSwatches',
    data: () => {
        return {
            selectedPalette: null,
            badName: false,
            name: '',
            colors: [
                        {
                            id: 1,
                            badName: false,
                            color: '#aa00ff',
                        },
                    ],
        }
    },
    async created() {
        if (this.$root.$data.selectedPaletteID == 0) {
            return;
        }
        try {
            const response = await axios.get('/api/palettes/' + this.$root.$data.selectedPaletteID);
            this.selectedPalette = response.data;
        }  catch (error) {
            console.log(error); 
        }
    },
    methods: {
        async addSwatch() {
            // We only update badName here because we don't want the field to be red until they attempt to submit
            this.badName = !this.name; // badName = we don't have a name

            // check to make sure each color is appropriate
            let colorFail = false;
            for (let c of this.colors) {
                if (!/^#[0-9a-fA-F]{6}$/.test(c.color)) { // regex: #[hex char]{6 times}
                    c.badName = true;
                    colorFail = true;
                } else {
                    c.badName = false;
                }
            }

            // If there's a bad color name or no swatch name, just return early
            if (colorFail || this.badName)
                return;
            
            try {
                await axios.post('/api/palettes/' + this.selectedPalette._id + '/swatches/', {
                    // The prefab swatches have .added, but that's just a remnant of how we add keep track of which ones we've added
                    id: this.$root.$data.userGeneratedID++, // increase id at the same time so we don't get duplicate ids
                    name: this.name,
                    colors: this.colors.map(el => el.color),
                });
                // reset after creation
                this.badName = false;
                this.name = '';
                this.colors = [
                    {
                        id: 1,
                        badName: false,
                        color: '#aa00ff',
                    },
                ];
            } catch (error) {
                console.log(error);
            }
        },
        addColor() {
            if (this.colors.length > 7)
                return;
            this.colors.push({
                id: this.colors[this.colors.length-1].id+1,
                badName: false,
                color: '#' + (Math.floor(Math.random()*0xeeeeee) + 0x111111).toString(16),
            });
        },
        removeColor(color) {
            if (this.colors.length == 1)
                return;
            let index = this.colors.findIndex(el => el.id == color.id);
            this.colors.splice(index, 1);
        }
    },
    computed: {
    }
}
</script>

<style scoped>

.name {
  font-weight: bold;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 70%;
  max-width: 800px;

  margin: auto;

  border: 1px solid black;

  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

#inputName {
  border: none;
  margin-bottom: 2px;
  text-align: center;
  font-weight: bold;
  font-size: 20px;
  width: 95%;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

#inputName:focus {
  outline: none;
}

.color-row {
  width: 100%;
  min-height: 50px;

  display: grid;
  grid-template-columns: 30% 60% 10%;
}

.color-name {
  /* border: none; */
  resize: none;
  word-wrap: break-word;
  word-break: break-all;
  font-size: 18px;
  color: black;
  letter-spacing: 1px;
}

.color {
  /* height: 110; */
  width: 100%;
}

.removeButton {
  max-width: 100%;
}

.button-container {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 0;
  background-color: black;
}

.button-container button {
  width: 50%;
  font-size: 18px;
  /* margin: 0; */
  /* border: 0; */
  /* padding: 0; */
}

.badName {
  background-color: lightcoral;
}

button {
  color: white;
  border: 1px solid black;
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