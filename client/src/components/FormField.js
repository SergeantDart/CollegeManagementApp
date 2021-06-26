import React from "react";


const FormField = ({formData, changeHandle, id}) => {

    const renderErrorMessage = () => {
        let errorMessage = null;

        if(!formData.isValid && formData.validation) {
            errorMessage = (
                <div className="error">
                    {formData.validationMessage}
                </div>
            )
        }

        return errorMessage;
    }


    const renderFormField = () => {
        let formTemplate = null;

        switch(formData.element) {
            case "input":
                formTemplate = (
                    <div className="form-group form-inline">
                        <label>
                            {formData.config.label}
                            <input
                                {...formData.config}
                                value={formData.value}
                                onChange={(event) => changeHandle({event, id, isBlurred: false})}
                                onBlur={(event) => changeHandle({event, id, isBlurred: true})}/>
                        </label>
    
                        {renderErrorMessage()}
                    </div>
                )
                break;
            case "select":
                formTemplate = (
                    <div className="form-group form-inline">
                        <label>
                            {formData.config.label}
                            <select
                                {...formData.config}
                                value={formData.value}
                                defaultValue={formData.defaultValue || ""}
                                name={formData.config.name}
                                onChange={(event) => changeHandle({event, id, isBlurred: false})}
                                onBlur={(event) => changeHandle({event, id, isBlurred: true})}>
                                    {!formData.defaultValue ?  <option value="" disabled>Choose an option...</option> : null }
                                    {formData.config.options.map((item, index) => {
                                        return (
                                            <option key={index} value={item.id}>{item.name}</option>
                                        );
                                    })}
                            </select>
                        </label>
                    </div>
                );
                break;
            default: 
                formTemplate = null;
        }
        
        return formTemplate;
    }
    return (
        <div>
            {renderFormField()}
        </div>
    );
}

export default FormField;