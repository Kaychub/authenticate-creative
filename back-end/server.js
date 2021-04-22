let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');

const app = express();

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const cookieSession = require('cookie-session');
app.use(cookieSession({
    name: 'session',
    keys: ['secretValue'],
    cookie: {
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));

// parse application/json
app.use(bodyParser.json());

// import the users module and setup its API path
const users = require("./users.js");
app.use("/api/users", users.routes);
const validUser = users.valid;

// connect to the database
mongoose.connect('mongodb://localhost:27017/palette-auth', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


const paletteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  },
  name: String,
  creationDate: Date,
})

const Palette = mongoose.model('Palette', paletteSchema);

app.post('/api/palettes', validUser, async (req, res) => {
  const palette = new Palette({
    user: req.user,
    name: req.body.name,
    creationDate: req.body.creationDate,
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

app.delete('/api/palettes/:paletteID', validUser, async (req, res) => {
  try {
    let palette = await Palette.findOne({_id: req.params.paletteID});
    if (!palette) {
      res.send(404);
      return;
    }
    // make sure the user owns this
    if (palette.user.toString() !== req.user._id.toString()) {
      return res.status(403).send({
        message: 'User doesn\'t own this palette'
      });
    }
    await palette.delete();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.put('/api/palettes/:paletteID', validUser, async (req, res) => {
  try {
    let palette = await Palette.findOne({_id: req.params.paletteID});
    if (!palette) {
      res.send(404);
      return;
    }
    // make sure the user owns this
    if (palette.user.toString() !== req.user._id.toString()) {
      return res.status(403).send({
        message: 'User doesn\'t own this palette'
      });
    }
    palette.name = req.body.name;
    palette.creationDate = req.body.creationDate;
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
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  },
  name: String,
  isAdded: Boolean,
  colors: Array,
})

const Swatch = mongoose.model('Swatch', swatchSchema);

app.post('/api/palettes/:paletteID/swatches', validUser, async (req, res) => {
  try {
    let palette = await Palette.findOne({_id: req.params.paletteID});
    if (!palette) {
      res.send(404);
      return;
    }
    // Make sure the user owns the palette where this swatch belongs
    if (palette.user.toString() !== req.user._id.toString()) {
      return res.status(403).send({
        message: 'User doesn\'t have acces to this palette'
      });
    }
    let swatch = new Swatch({
      user: req.user,
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

app.put('/api/palettes/:paletteID/swatches/:swatchID', validUser, async (req, res) => {
  try {
    let swatch = await Swatch.findOne({_id: req.params.swatchID, palette: req.params.paletteID});
    if (!swatch) {
      res.send(404);
      return;
    }
    // Make sure the user owns this swatch
    if (swatch.user.toString() !== req.user._id.toString()) {
      return res.status(403).send({
        message: 'User doesn\'t own this swatch'
      });
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

app.delete('/api/palettes/:paletteID/swatches/:swatchID', validUser, async (req, res) => {
  try {
    let swatch = await Swatch.findOne({_id: req.params.swatchID, palette: req.params.paletteID});
    if (!swatch) {
      res.send(404);
      return;
    }
    // Make sure the user owns the swatch
    if (swatch.user.toString() !== req.user._id.toString()) {
      return res.status(403).send({
        message: 'User doesn\'t own this swatch'
      });
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