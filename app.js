

const express       =       require("express");
const bodyParser    =       require("body-parser");


const stripe            =       require("stripe")("sk_test_yvbDXGEl7HzRrY4SrTAgz8gl")
sgMail         =       require('@sendgrid/mail');

// PUT YOUR API KEY HERE !
sgMail.setApiKey("<<your_API_key>>");

const app = express();

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: true}));



// Routes


app.listen(3000, function() {
    
  console.log("server started on port 3000");

}); 
  

app.get('/', function (req, res) {

  res.render('index.ejs');

});




// Rota de pagamentos

  app.post("/payment", function(req, res) {

    console.log(req.body);

    stripe.charges.create({
      amount: req.body.valor,
      currency: "eur",
      description: "some product",
      source: req.body.stripeToken,
      }, function(err, charge) {

          if(err) {
              console.log(err)
              return res.send("Um erro inesperado ocorreu, tenta de novo");
          }

          
          // sendPaymentEmail(req)
          sendPaymentEmail(req)
          res.send("Success!");
      });

  });





async function sendPaymentEmail (req) {


    var info = {
              email: req.body.stripeEmail,
              price: req.body.valor/100 +" euros",
              name: req.body.stripeBillingName,
              address: req.body.stripeBillingAddressLine1 + " " + req.body.stripeBillingAddressZip,
              description: req.body.description,
              date: req.body.date
          }
      
    
    var content = "<p>Olá "+req.body.stripeBillingName+",<br><br>O teu pagamento de x euros foir recebido</p>";

    const msg = {
        to: info.email,
        from: "eddisrupt@gmail.com",
        subject: "Pagamento bem sucedido",
        text: "Pagamento bem sucedido",
        html: content
    };

    sgMail.send(msg, function(err){

        if(err) {
         return console.log(err);
        }
    });
  }




  

  
  
  


  







  
  