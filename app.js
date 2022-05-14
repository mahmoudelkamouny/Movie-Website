const fs= require('fs')
const express = require('express')
const app = express()
const path = require('path')
var bodyParser = require('body-parser')
var session = require('express-session')
var movies = new Array();
//////////////////////////////////////////////////
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname,'views') )

app.use(bodyParser.urlencoded({ extended: false }))
app.use(session ({secret : '1001', saveUninitialized : true, resave : true}))

if(process.env.PORT){
    app.listen(process.env.PORT)
}else{
    app.listen(3000)
}

movies.push('conjuring', 'darkknight', 'fightclub', 'godfather', 'godfather2', 'scream')
/////////////////////////////////////////////////////////////////

let loadUsers = function(){
    try {
        let data = fs.readFileSync('userData.json')
        let dataString = data.toString()
        let usersArray = JSON.parse(dataString)
        return usersArray 
    } catch (error) { //file not found 
        return []
    }
    
}

let loadwatchList = function(curUser){
    let users = loadUsers();
    for(i = 0; i < users.length; i++){
        if(users[i].un === curUser){
            return users[i].watchList;
        }
    }
}

function containsUserName(obj, list) {
    for (i = 0; i < list.length; i++) {
        if (list[i].un === obj.un) {
            return true;
        }
    }
    return false;
}

function containsUser(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i].un === obj.un && list[i].pw === obj.pw) {
            return true;
        }
    }

    return false;
}

var addToWatchList = function(movie,list,curUser){
    var i;
    for(i = 0; i<list.length; i++){
        if(list[i].un === curUser){
            if(!list[i].watchList.includes(movie)){
                list[i].watchList.push(movie)
                fs.writeFileSync('userData.json',JSON.stringify(list))
            }else{
                return false;
            }    
        }
    }
    return true;
}

var valid = function(un,pw){
    return un!=null && pw!=null && un!='' && pw!=''
}

/////////////////////////////////////////////////////////////////////////////////

app.get('/', function(req,res){
    res.render('login', {
       users: loadUsers()
    })
})


app.get('/registration', function(req,res){
    res.render('registration', {
       users: loadUsers() 
    })
})


app.get('/home', function(req,res){
    res.render('home', { 
        users : loadUsers()
    })
})


app.get('/drama', function(req,res){
    res.render('drama', { 
    })
})

app.get('/horror', function(req,res){
    res.render('horror', {
    })
})

app.get('/action', function(req,res){
    res.render('action', {
    })
})

app.get('/godfather', function(req,res){
    res.render('godfather', {
    })
})

app.get('/godfather2', function(req,res){
    res.render('godfather2', {
    })
})

app.get('/scream', function(req,res){
    res.render('scream', { 
    })
})

app.get('/conjuring', function(req,res){
    res.render('conjuring', {
    })
})

app.get('/fightclub', function(req,res){
    res.render('fightclub', {
    })
})

app.get('/darkknight', function(req,res){
    res.render('darkknight', { 
    })
})

app.get('/watchlist', function(req,res){
    res.render('watchlist', {
       list : loadwatchList(req.session.username)
    })
})

app.get('/searchresults', function(req,res){
    res.render('searchresults', {
       list : recommend 
    })
})

/////////////////////////////////////////////////////////

app.post('/', function(req,res){ //login
    var un=req.body.username
    var pw=req.body.password
    req.session.username = req.body.username

    function user(un,pw){
        this.un=un
        this.pw=pw
    }

    let users=loadUsers()

    if(!containsUser(new user(un,pw),users)){
        //wrong entry
        res.send('The username or password that you have entered are not correct!')
    }else{
        res.redirect('/home')
    }

    
})

app.post('/register', function(req,res){ //register
    var un=req.body.username
    var pw=req.body.password
    var watchList=new Array()

    function user(un,pw,watchList){
        this.un=un
        this.pw=pw
        this.watchList=watchList
    }

    let users= loadUsers()

    if(!valid(un,pw)){
        //null entry
        res.send('please insert a valid username and password')
    }else if(containsUserName(new user(un,pw,watchList),users)){
        //user is already present
        res.send('The username you entered is already taken!')
    }else{
        //add user
        users.push(new user(un,pw,watchList))
        fs.writeFileSync('userData.json',JSON.stringify(users))
        res.send('Thank you for signing up successfully')
    }
})

var recommend = new Array()

app.post('/search', function(req,res){ 
    recommend = new Array()
    var str = req.body.Search
    var i = 0
    for(i = 0; i<movies.length; i++){
        if(movies[i].includes(str)){
            recommend.push(movies[i])
        }
    }
    res.redirect('/searchresults')
})

app.post('/conjuring', function(req,res){
    let users = loadUsers()
    if(!addToWatchList('conjuring',users,req.session.username))
        res.send('conjuring is already in your watchlist!')
})

app.post('/darkknight', function(req,res){
    //  console.log(req.session.username)
    let users = loadUsers()
    if(!addToWatchList('darkknight',users, req.session.username))
       res.send('darkknight is already in your watchlist!')
})

app.post('/fightclub', function(req,res){
    let users = loadUsers()
    if(!addToWatchList('fightclub',users,req.session.username))
        res.send('fightclub is already in your watchlist!')
})

app.post('/godfather', function(req,res){
    let users = loadUsers()
    if(!addToWatchList('godfather',users,req.session.username))
        res.send('the godfather is already in your watchlist!')
})

app.post('/godfather2', function(req,res){
    let users = loadUsers()
    if(!addToWatchList('godfather2',users,req.session.username))
        res.send('the godfather 2 is already in your watchlist!')
})

app.post('/scream', function(req,res){
    let users = loadUsers()
    if(!addToWatchList('scream',users,req.session.username))
        res.send('scream is already in your watchlist!')
})

