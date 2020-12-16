export const initialState ={
    basket: [],
    user: null
  
} 
    //Selector
    export const getBasketTotal =(basket) => 
        basket?.reduce((amount, item) => item.price + amount, 0)
     


//listener function
const  reducer  =   (state, action ) => {
    
         switch(action.type) {
            case  'ADD_TO_BASKET':
                return { // contents of the basket
                    ...state, // initital contents
                    basket: [...state.basket, action.item], //contents on clicking add to basket
                }


            case "EMPTY_BASKET":
                return {
                    ...state,
                    basket: []
                }

            case "REMOVE_FROM_BASKET":
            const index = state.basket.findIndex(
                (basketItem) => basketItem.id === action.id
            )    
            let newBasket = [...state.basket];
             
            if (index >= 0) {
                newBasket.splice(index, 1)

            }else {
                console.warn(
                    `Can't remove product (id: ${action.id} as it's not in basket!`
                    )
                
            }
            return {
                ...state,
                basket: newBasket
            }
            case "SET_USER":
                return {
                    ...state,
                    user: action.user
                }

                default: 
                return state;
        }
               
}

export default reducer;