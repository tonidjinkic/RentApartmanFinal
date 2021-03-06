let express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Apartment  = require("./models/apartment"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    opn = require("open"),
    PORT = process.env.PORT || 3000;

    //requiring routes
var commentRoutes = require("./routes/comments"),
    apartmentRoutes = require("./routes/apartments"),
    indexRoutes = require("./routes/index")

    mongoose.connect("mongodb+srv://toni123:toni123@cluster0.et5ds.mongodb.net/fpmoz_informatika?retryWrites=true&w=majority",{useNewUrlParser:true,useUnifiedTopology:true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
//seedDB();
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION

app.use(require("express-session")({
    secret:"Svi cemo raditi u krezica",
    resave:false,
    saveUninitialized:false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// da prosljedjujemo currentUsera na svakoj ruti,funckija se sama pozove na svakoj ruti i flash

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
 });

// to govori aplikaciji da koristi ta 3 file za rute
app.use(indexRoutes);
app.use(commentRoutes);
app.use(apartmentRoutes);

app.listen(PORT, function(){
   console.log("The RentApartman Server Has Started!");
});