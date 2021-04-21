let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));

// parse application/json
app.use(bodyParser.json());

// connect to the database
mongoose.connect('mongodb://localhost:27017/todo', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const paletteSchema = new mongoose.Schema({
  name: String,
  creationDate: Date,
  isFavorite: Boolean,
})

const Palette = mongoose.model('Palette', paletteSchema);

app.post('/api/palettes', async (req, res) => {
  const palette = new Palette({
    name: req.body.name,
    creationDate: req.body.creationDate,
    isFavorite: req.body.isFavorite,
  });
  try {
    palette.save();
    res.send(palette);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get('/api/palettes', async (req, res) => {
  try {
    const palettes = await Palette.find(); // find all palettes
    res.send(palettes);
  } catch (error) {
    console.log(500);
    res.sendStatus(500);
  }
});

app.get('/api/palettes/:paletteID', async (req, res) => {
  try {
    const palette = await Palette.findOne({_id: req.params.paletteID});
    if (!palette) {
      res.send(404);
      return;
    }
    res.send(palette);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
})

app.delete('/api/palettes/:paletteID', async (req, res) => {
  try {
    let palette = await Palette.findOne({_id: req.params.paletteID});
    if (!palette) {
      res.send(404);
      return;
    }
    await palette.delete();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.put('/api/palettes/:paletteID', async (req, res) => {
  try {
    let palette = await Palette.findOne({_id: req.params.paletteID});
    if (!palette) {
      res.send(404);
      return;
    }
    palette.name = req.body.name;
    palette.creationDate = req.body.creationDate;
    palette.isFavorite = req.body.isFavorite;
    await palette.save();
    res.send(palette);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});


const swatchSchema = new mongoose.Schema({
  palette: {
    type: mongoose.Schema.ObjectId,
    ref: 'Palette',
  },
  name: String,
  isAdded: Boolean,
  colors: Array,
})

const Swatch = mongoose.model('Swatch', swatchSchema);

app.post('/api/palettes/:paletteID/swatches', async (req, res) => {
  try {
    let palette = await Palette.findOne({_id: req.params.paletteID});
    if (!palette) {
      res.send(404);
      return;
    }
    let swatch = new Swatch({
      palette: palette,
      name: req.body.name,
      isAdded: req.body.isAdded,
      colors: req.body.colors,
    });
    await swatch.save();
    res.send(swatch);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get('/api/palettes/:paletteID/swatches', async (req, res) => {
  try {
    let palette = await Palette.findOne({_id: req.params.paletteID});
    if (!palette) {
      res.send(404);
      return;
    }
    let swatches = await Swatch.find({palette: palette});
    res.send(swatches);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.put('/api/palettes/:paletteID/swatches/:swatchID', async (req, res) => {
  try {
    let swatch = await Swatch.findOne({_id: req.params.swatchID, palette: req.params.paletteID});
    if (!swatch) {
      res.send(404);
      return;
    }
    swatch.name = req.body.name;
    swatch.isAdded = req.body.isAdded;
    swatch.colors = req.body.colors;
    await swatch.save();
    res.send(swatch);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete('/api/palettes/:paletteID/swatches/:swatchID', async (req, res) => {
  try {
    let swatch = await Swatch.findOne({_id: req.params.swatchID, palette: req.params.paletteID});
    if (!swatch) {
      res.send(404);
      return;
    }
    await swatch.delete();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
})

/*
Other requests
*/


app.listen(3001, () => console.log('Server listening on port 3001!'));