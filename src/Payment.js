import React, {useState, useEffect} from 'react'
import { Link, useHistory} from 'react-router-dom';
import CheckoutProduct from './CheckoutProduct';
import './Payment.css'
import { useStateValue } from './StateProvider';
import {CardElement, useStripe, useElements} from "@stripe/react-stripe-js"
import CurrencyFormat from 'react-currency-format';
import { getBasketTotal } from './reducer';
import axios from './axios';
import { db } from './firebase';


function Payment() {
const [{ basket, user}, dispatch] = useStateValue();
const history = useHistory();

const stripe=useStripe();
const elements = useElements();

const [succeeded, setSucceeded] = useState(false);
const [processing, setProcessing] = useState("");
const [error, setError] = useState(null);
const [disabled, setDisabled] = useState(true);
const [clientSecret, setClientSecret] = useState(true);

useEffect(() => {
    //generate the special secret which allows us to charge a customer
    const getClientSecret = async () => {
        const response = await axios({
            method: 'post',
            //Stripe expects the total in a currencies subunits
            url: `/payments/create?total=${getBasketTotal(basket) * 100}`
        });
        setClientSecret(response.data.clientSecret)
    }
    getClientSecret();
},[basket])

console.log('THE SECRET IS >>>', clientSecret)
console.log('DEBUGGING... >>>', user)







const handleSubmit = async (event) => {
    // do all fancy stripe stuff 
    event.preventDefault();
     if(!user){
         setError(<strong> Please <Link to="/login">Sign In</Link> To Continue Transaction</strong>)
         
     }     
    
     setProcessing(!user ? false : true);
    

  const payload = await stripe.confirmCardPayment(clientSecret,  {
      payment_method: {
          card: elements.getElement(CardElement)
      }
      
  }).then(({paymentIntent}) => {

          //paymentIntent = payment Confirmation
          console.log('THESE ARE THE CONTENTS OF THE BASKET>>>>', basket)
          
          db
          .collection('users')
          .doc(user?.uid)
          .collection('orders')
          .doc(paymentIntent.id)
          .set({
              basket: basket,
              amount: paymentIntent.amount,
               created: paymentIntent.created
               
          })
          

                   

          setSucceeded(true);
          setError(null);
          setProcessing(false)

          dispatch({
              type: 'EMPTY_BASKET'
          })

          history.replace('/orders')

                  
      }) 

}

const handleChange = event => {
    // listens for changes in the card element
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "")
}
    return (
        <div className = 'payment'>
            <div className = 'payment__container'>
            
    <h1>Checkout (<Link to ="/checkout">{basket?.length} items</Link>)

                </h1>
                {/*  Payment section --delivery address*/}
                <div className = 'payment__section'>
                    <div className = 'payment__title'>
                        <h3>Delivery Address</h3>
                    </div>
                    <div className = 'payment__addrdess'>
                        <p>{user?.email}</p>
                        <p>123 React lane</p>
                        <p>Los Angeles, CA</p>
                    </div>
                    
                </div>
                {/*  Payment section --Review Items*/}
                <div className = 'payment__section'>
                <div className = 'payment__title'>
                        <h3>Review items and Delivery</h3>
                </div>
                    <div className='payment__items'>
                        {basket.map(item => (
                            <CheckoutProduct
                                item = {item.id}
                                title = {item.title}
                                image = {item.image}
                                price = {item.price}
                                rating = {item.rating}
                            />

                        ))}
                        
                    </div>
                </div>
                {/*  Payment section --Payment method*/}
                <div className = 'payment__section'>
                <div className = 'payment__title'>
                        <h3> Payment Method</h3>
                </div>
                <div className = 'payment__details'>
                    {/*Stripe Logics*/}

                    <form onSubmit = {handleSubmit}>
                        <CardElement onChange = {handleChange} />

                        <div className='payment__price container'>
                            <CurrencyFormat 
                            renderText={(value) => (
                                <h3>Order ToTal: {value} </h3>
                            )

                        }
                            decimalScale={2}
                            value ={getBasketTotal(basket)}
                            displayType={"text"}
                            thousandSeparator={true}
                            prefix={"#"}
                            />
                            <button disabled={processing || disabled || succeeded}>
                                 <span>{processing ? <p>Processing</p> : "Buy Now"}</span>
                            </button>
                            

                        </div>
                        {/* Form Errors*/}
                        {error && <div>{error}</div>}
                    </form>
                    
                </div>  

                </div>


            </div>
         </div>
            
        
    )
}

export default Payment
