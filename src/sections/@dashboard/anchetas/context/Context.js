import { createContext, useReducer } from "react";

export const Insumoscontext = createContext()
export const Context = (props) => {
    const reducer = (state, action) =>{
        switch (action.type) {
            case 'AddInsumo':
                const tempstate=state.filter((insumo)=>action.payload.ID_Insumo===insumo.ID_Insumo)
                if(tempstate.length>0){
                    return state
                }else{
                    return[...state, action.payload];
                }
            case 'Increment':
                const tempstate1=state.map((insumo)=>{
                    if(insumo.ID_Insumo === action.payload.ID_Insumo){
                        return {...insumo, Cantidad:insumo.Cantidad+1} 
                    }else{
                        return insumo
                    }
                })
                return tempstate1
            case 'Decrement':
                const tempstate2=state.map((insumo)=>{
                    if(insumo.ID_Insumo === action.payload.ID_Insumo){
                        if (insumo.Cantidad > 1) {
                            return { ...insumo, Cantidad: insumo.Cantidad - 1 };
                        } else {
                            return insumo;
                        }
                    }else{
                        return insumo;
                    }
                })
                return tempstate2
            case 'RemoveInsumo':
                const tempstate3=state.filter(
                    (insumo)=>insumo.ID_Insumo !== action.payload.ID_Insumo
                );
                return tempstate3;
            case 'ResetInsumos':
                return [];        
            default:
                return state;

        }
    }
    const [state, dispatch] = useReducer(reducer, [])
    const insumoInfo={state, dispatch}
    return(
        <Insumoscontext.Provider value={insumoInfo}>{props.children}</Insumoscontext.Provider>
    ); 
};