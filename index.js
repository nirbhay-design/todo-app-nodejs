const express = require('express')

const mysql = require('mysql');



const db = mysql.createConnection({
    host:'bwpe457e6j7dygf6xzrw-mysql.services.clever-cloud.com',
    user: 'um7bklcctn6ndx67',
    password:'zEG3RDFa4mcik5xuHhar',
    port:3306,
    database:'bwpe457e6j7dygf6xzrw'
});

db.connect((err)=>{
    if (err){
        console.log(err);
    } else {
        console.log("database connected successfully")
    }
})

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(express.urlencoded({ extended:true}))

app.get('/',(req,res)=>{
    res.render('home')
})

app.get('/login',(req,res)=>{
    res.render('login');
})
app.get('/register',(req,res)=>{
    res.render('register');
})

app.post('/login',(req,res)=>{
    let username = req.body.email
    let pass = req.body.pass
    let sql = `select * from userinfo where username='${username}' and passwd='${pass}'`
    db.query(sql,(err,result)=>{
        if(err) { console.log(err);res.json("error occured1") }
        else {
            if (result.length > 0){
                res.redirect(`/login/${username}`)
            } else{
                res.json("user does not exist")
            }
        }
    })
})



app.get('/login/:username',(req,res)=>{
    let sql = `select * from todos where username='${req.params.username}'`
    db.query(sql,(err,result)=>{
        if(err) {
            res.json("error occured");
        }
        else {
            
            res.render('maketodos',{result:result,user:req.params.username})
        }
    })
})

app.post('/login/:username',(req,res)=>{
    let todotitle = req.body.todo
    let sql = `insert into todos(username,todotitle,tododesc,done) values('${req.params.username}','${todotitle}','None',0)`
    db.query(sql,(err,result)=>{
        if(err) { 
            res.json("error occured")
        } else {
            res.redirect(`/login/${req.params.username}`)
        }
    })
})

app.post('/register',(req,res)=>{
    let username = req.body.email
    let pass = req.body.pass
    let name = req.body.name
    let sql = `select * from userinfo where username = '${username}'`
    db.query(sql,(err,result)=>{
        if (err) { res.json("error occured") }
        else if (result.length >0) {
            res.json("user already exist try another username")
        } else{
            db.query(`insert into userinfo values('${username}','${pass}','${name}')`,(err,reslt)=>{
                if (err) { res.json("error occured") }
                else{
                    res.redirect('/login')
                }
            })
        }
    })
})

// app.get('/addtodo/:username',(req,res)=>{
//     res.render('atd')
// })

// app.post('/addtodo/:username',(req,res)=>{
//     res.json('posted here');
// })

app.get('/delete/:username/:id',(req,res)=>{
    let sql = `delete from todos where tid=${req.params.id}`
    db.query(sql,(err,result)=>{
        if(err) { res.json("error occured")}
        else{
            res.redirect(`/login/${req.params.username}`)
        }
    })
})

app.get('/edit/:username/:id',(req,res)=>{
    let sql = `select * from todos where tid=${req.params.id}`
    db.query(sql,(err,result)=>{
        if(err) { res.json("error")}
        else {
            res.render("edit",{user:req.params.username,id:req.params.id,result:result[0]})
        }
    })
})

app.post('/edit/:username/:id',(req,res)=>{
    let updated_todo = req.body.utodo;
    let sql = `update todos set todotitle='${updated_todo}' where tid=${req.params.id}`
    db.query(sql,(err,result)=>{
        if (err) { res.json("error occured")}
        else{
            res.redirect(`/login/${req.params.username}`)
        }
    })
})

app.listen(process.env.PORT || 3000,()=>{
    console.log("app is listening at 3000 port")
})