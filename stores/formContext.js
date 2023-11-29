import {createContext, useEffect, useState, useMemo} from 'react'
import styled,{createGlobalStyle} from 'styled-components'

const FormContext = createContext({
    // ok: null,
    // cartBox: null,
    // setCartBox: null,
})
export default FormContext

export const FormContextProvider = ({children}) => {


    let [FieldsetRadioStyled, setFieldsetRadioStyled] = useState("fieldset")
    , [SectionCheckboxStyled, setSectionCheckboxStyled] = useState("section")
    , templateScss = {
        colors: {
        "$primary":"#9356DC",
        // $secondary:#1397EB;
        "$secondary":"#1F4EEA",
        "$secondary_1":"#2989d8",
        "$secondary_2":"#a1e1f480",
        "$ternary":"goldenrod",
        "$ternary_1":"#EBE813",
        "$ternary_2":"#96943E",
        "$fourth":"#cc0000",
        "$fourth_1":"#ff59004d",
        }
    }

    useEffect(() => { 
        console.log(FieldsetRadioStyled);
    }, [])
    useEffect(() => { 
        setFieldsetRadioStyled(styled.fieldset`
            display: flex;
            flex-flow: wrap;
            >section{
                width: 100%;
                display: flex;
            }
            label.radioLabel{
                display: block;
                flex:1 1 30%;
                position: relative;
                // padding-left: 4rem;
                padding: 1em 0 0.25em;
                margin: 1.5rem 0 1.5em;
                text-align:center;
                cursor: pointer;
                font-size: 2rem;
                user-select: none;
                color: #555;
                line-height: .75em;
                >section{
                    text-align: center;
                }
                &:hover>input~span.radio{
                    //using opacity for hover effect, because background is used (amd delayed!) for the shuffle
                    // opacity: 0.8;
                }
                input{
                    position: absolute;
                    opacity: 0;
                    cursor: pointer;
                    height: 0;
                    width: 0;
                    &:checked {
                        ~span{
                            color: ${templateScss.colors.$secondary};
                            transition: color .5s;
                            &.radio {
                                background-color: ${templateScss.colors.$secondary};
                                opacity: 1!important;
                                &::after {
                                    opacity: 1;
                                    //applying in JS, so as not to make selections delayed when no js:
                                    // transition: opacity 0s 0.75s;
                                }
                            }
                        }
                    }
                }
                >span{
                    &.radio {
                        position: absolute;
                        top: -.5em;
                        left: calc(50% - 1.25rem);
                        height: 2.5rem;
                        width: 2.5rem;
                        background: #c9ded6;
                        border-radius: 50%;
                        &::after {
                            display: block;
                            content: '';
                            position: absolute;
                            opacity: 0;
                            top: .5rem;
                            left: .5rem;
                            width: 1.5rem;
                            height: 1.5rem;
                            border-radius: 50%;
                            background: #fff;
                            //applying in JS, so as not to make selections delayed when no js:
                            // transition: opacity 0s 0.75s;
                        }
                    }
                    >b{
                      display: block;
                      font-size: .5em;
                    }
                }
            }
        `)
        setSectionCheckboxStyled(styled.section`
            
            display:unset !important;
            background: #384c60;
            height: 50px;
            width: 150px !important;
            overflow: hidden;
            border-radius: 3px;
            cursor: pointer;
            >label{
                cursor: pointer;
                input{
                    opacity: 0;
                    position: absolute;
                    left: -10000px;
                    &:checked{
                    +span{
                        margin-left: 0;
                    }
                    ~.indicator{
                        .circ{
                        stroke: #557D25;
                        opacity: 1;
                        }
                        .tick{
                        opacity: 1;
                        stroke-dashoffset: 0;
                        transition-delay: 0.5s;  
                        }
                        .cross{
                        opacity: 0;
                        transition: stroke-dashoffset 0.5s ease, opacity 0.5s ease;
                        transition-delay: 0;
                        stroke-dashoffset: 15;
                        }
                    }
                    }
                }
                >span{
                    float: left;
                    color: #fff;
                    font-family: Arial;
                    font-weight: bold;
                    text-align: center;
                    width: 66%;
                    height: 100%;
                    background: #0380b3;
                    display: block;
                    font-size: 14px;
                    line-height: 50px;
                    -webkit-transition: margin 0.2s linear;
                    -moz-transition: margin 0.2s linear;
                    -ms-transition: margin 0.2s linear;
                    -o-transition: margin 0.2s linear;
                    transition: margin 0.2s linear;
                    margin-left: -66%;
                    &:first-of-type{line-height: 1.75em;}
                    ~span{
                    margin-left: 0;
                    background: none;
                    font-size:.75em;
                    }
                }
                >i.indicator{
                    float: left;
                    background: #ccc;
                    height: 100%;
                    width: 34%;
                    padding: 8px;
                    box-sizing: border-box;
                    >svg{
                    >path{
                        &.circ{
                        stroke:#CD4C10;
                        transition: stroke 1s 0.2s;
                        }
                    }
                    >polyline{
                        &.tick{
                        stroke-dasharray: 20;
                        stroke-dashoffset: 20;
                        transition: stroke-dashoffset 0.3s;
                        transition-delay: 0s;
                        }
                        &.cross{
                        /* opacity: 1; */
                        stroke-dasharray: 15;
                        stroke-dashoffset: 0;
                        transition: stroke-dashoffset 0.25s ease-in;
                        transition-delay: 0.5s;
                        +.cross{
                            transition-delay: 0.25s;
                        }
                        }
                    }
                    }
                }
            }
        `)
    }, [])
    const context = {SectionCheckboxStyled, FieldsetRadioStyled}
    
    return (
        <FormContext.Provider value={context}>
            {children}
        </FormContext.Provider>
    )
}


