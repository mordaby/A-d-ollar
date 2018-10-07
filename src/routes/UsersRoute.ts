import {Router,Request,Response,NextFunction} from 'express';
import { model, Mongoose, mongo } from 'mongoose';
import Users from '../models/users';
import { hash } from '../../node_modules/@types/bcryptjs';


//const Useres = require('../data');

class UserRoutes
{
    router:Router;
    Prop:string[];
    constructor(){
        this.router = Router();
        this.routes();
        this.init();
    }
    init(){
        
    }


    public GetAllUsers(req:Request,res:Response):void{
        Users.find({}).then((data) => {
            res.status(200).json({
                Data:data,
            })
        })
        .catch((err) => {
           const status =  res.statusCode;
            res.json({
                Status:status,
                err:err
            })
        })
    }
    public GetUsersById(req:Request,res:Response):void{
          const email:String = req.params.email;
            
        Users.findOne({email:email}).then((data) => {
            if (!data){
                res.status(404).json({
                    err:'does not exist'
                })
            }
            else{
            res.status(200).json({
                Data:data,
            })
        }
        })
        .catch((err) => {
           const status =  res.statusCode;
            res.json({
                Status:status,
                err:err
            })
        })
    }
    public CreateUser(req:Request,res:Response,next:NextFunction){
        
         
         var name = req.body.name;
         var gender = req.body.gender;
         var email = req.body.email;
         var password = req.body.password;
         var age = req.body.age;
        
        
        var user = new Users({
            
            name:name,
            gender:gender,
            email:email,
            password:password,
            age:age


        });
        user.check('a');
        
        let Pass = user.encPassword();

        Pass.then(function(hash){
            if(hash)
                user.password = hash;
            user.save().then((data)=>{

                console.log(user.password);
                res.status(res.statusCode).json({
                    Data:data,
                    status:res.statusCode
                })
            }).catch((err) => {
                const status =  res.statusCode;
                res.json({
                    Status:status,
                    err:err
                })
            })
        }).catch(err=>{console.log(err);});
    }
    public DeleteUser(req:Request,res:Response):void{
          const email = req.params.email;
           const status = res.statusCode;
          Users.findOneAndRemove(email,(err,removed)=>{
              
              if (err) 
              {
               return res.json({status});
              }
              res.json({
                  status,
                  removed
              })

          })
        
    }
    public Update(req:Request,res:Response){
        var email =  req.params.email;
        var user = req.body;

        
    }
    public UpdateUser(req:Request,res:Response){
        var email =  req.params.email;
        var user  =new Users(req.body.user);
        console.log(user);

        if(!user)
            return res.status(501).json({err:'undefined'});
        let Pass = user.encPassword();
        Pass.then(function(hash){
            if(hash)
                user.password = hash;
            Users.findOne({email:email}).exec((err,result)=>{
                user._id = result._id;
                if (err || !result) {
                    return res.status(res.statusCode).json({
                        Err:err
                    })
                }
                  Users.findOneAndUpdate({email:email},user,{new:true},).then((data)=>{

                    return res.status(res.statusCode).json({
                        Data:data
                    })
                    }).catch(err=>{
                        return res.status(res.statusCode).json({
                            Err:err
                    })
                
                
            })
        })
    }).catch(err=>res.status(404).json({Err:err}));
        
}
    
    routes() {

        this.router.get('/',this.GetAllUsers);
        this.router.get('/:email', this.GetUsersById)
        this .router.post('/newUser' , this.CreateUser);
        this.router.put('/:email',this.UpdateUser);
        this.router.delete('/:email',this.DeleteUser);
    }
} 

const routes = new UserRoutes();
routes.routes();
//routes.init();

export default routes.router;