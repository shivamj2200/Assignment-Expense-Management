let chai=require('chai');
let chaiHttp=require('chai-http');
const { doesNotThrow } = require('should');
let server=require("../index");

//assertion style
chai.should();

chai.use(chaiHttp);

describe('Task API',()=>{
  describe('get /api/getAll',()=>{
    it("It should Get all the user",(done)=>{
      chai.request(server)
      .get('/api/getAll')
      .end((err,response)=>{
        response.should.have.status(200);
        response.body.should.be.a('array');
        //response.body.length.should.be.eq(15);
        
    })
    done();
    
         })
         it("It should Not Get all the task",(done)=>{
            chai.request(server)
            .get('/apii/users')
            .end((err,response)=>{
              response.should.have.status(404);
              
             
          })
          done();
               })
               describe('post /api/create/',()=>{
                it("It should Post a new  user",(done)=>{
                  const user={
                    
                        name:"ritik",
                        email:"panday.riitik@tftuus.com",
                        password:"pass1234",
                        password2:"pass1234"
                                      };
                 chai.request(server)
                 .post('/api/create/')
                  .send(user)
  .end((err,response)=>{
                    response.should.have.status(200);
                    //response.body.should.be.a('array');
                    
                   
                })
                done()
              
                
                     })
                     describe('post /api/login',()=>{
                        it("It should login a new  user",(done)=>{
                          const user={
                                email:"panday.ritik@tftus.com",
                                password:"pass1234"
                                          };
                         chai.request(server)
                         .post('/api/login')
                          .send(user)
            
                      .end((err,response)=>{
                            response.should.have.status(200);
                            response.body.should.be.a('object');
                            
                           
                        })
                        done()
                      
                        
                             })
                             describe('post /api/createExpense',()=>{
                                it("It should add new expense",(done)=>{
                                    const token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjcwZDMxY2QyYTI1YTllZmFlMjM0MjMiLCJlbWFpbCI6InBhbmRheS5yaXRpa0B0ZnR1cy5jb20iLCJuYW1lIjoicml0aWsiLCJpYXQiOjE2NTE1NjEyNTAsImV4cCI6MTY1MTY0NzY1MH0.b0HVkIzDvoL0l7o1hNtWIO_j5VCFDcxeXrgRnRUUOv8'
                                  const user={
                                        name:"ritik pandey",
                                        amount:2086660,
                                        description:"new expence added",
                                        date:"12/12/2020"
                                                  };
                                 chai.request(server)
                                 .post('/api/createExpense')
                                 .set("Authorization", "Bearer " + token) //set the header first
                                 .send(user)
                                  .end((err,response)=>{
                                    response.should.have.status(200);
                                    response.body.should.be.a('object');  
                                })
                                done()
                                     })
                                     describe('get /api/expenseOne',()=>{
                                      it("It should show one expense",(done)=>{
                                          const token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjZiODQzYjRlZDcyNGJhZjNjNjVkNjciLCJlbWFpbCI6InJpdGlrcGFuZGV5QGdtYWlsLmNvbSIsIm5hbWUiOiJyaXRpayIsImlhdCI6MTY1MTIxNDQwMSwiZXhwIjoxNjUxMzAwODAxfQ.TkCxmsuDfAsYGP6gOH1pNw-2FPEMbbFvXdKotFGrRAk'
                                       chai.request(server)
                                       .get('/api/expenseOne')
                                       .set("Authorization", "Bearer " + token) //set the header first
                                        .end((err,response)=>{
                                          response.should.have.status(200);
                                          response.body.should.be.a('object');  
                                      })
                                      done()
                                           })

                                           describe('get /api/expenseAll',()=>{
                                            it("It should show all expense",(done)=>{
                                             
                                             chai.request(server)
                                             .get('/api/expenseAll')
                                            
                                              .end((err,response)=>{
                                                response.should.have.status(200);
                                                response.body.should.be.a('object');  
                                            })
                                            done()
                                                 })
                                                 describe('delete /api/expensedelete/:id',()=>{
                                                  it("It should delete a   task",(done)=>{
                                                const taskId='6270d8c30a0e3c8d70dc4b82';
                                                
                                                    const token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjcwZDMxY2QyYTI1YTllZmFlMjM0MjMiLCJlbWFpbCI6InBhbmRheS5yaXRpa0B0ZnR1cy5jb20iLCJuYW1lIjoicml0aWsiLCJpYXQiOjE2NTE1NjEyNTAsImV4cCI6MTY1MTY0NzY1MH0.b0HVkIzDvoL0l7o1hNtWIO_j5VCFDcxeXrgRnRUUOv8';
                                                    chai.request(server)
                                                    .delete('/api/expensedelete/'+taskId)
                                                    .set("Authorization", "Bearer " + token) //set the header first

                                                    
                                                    .end((err,response)=>{
                                                      response.should.have.status(200);
                                                      response.body.should.be.a('object');
                                                     
                                    
                                                      
                                                  })
                                                  done();
                                                  
                                                       })
                                                      })
                                                })
                                    })        
             
              
          
   
  
  

})
})
})
})
})