import { useEffect, useState } from "react";
import "./Alert.css";
import { useSelector } from "react-redux";

const closeIconStyles = {
  width: "1em",
  marginLeft: "94%",
};
function Alert(props: any) {
  // const alertMessage = useSelector((state: any) => state.common.alertMessage);
  const [formData, setFormData] = useState<any>({});
  const onFormUpdate = (evt: any) => {
    let _formData = { ...formData };
    if (evt.target.name) {
      _formData[evt.target.name as keyof Object] = evt.target.value;
    }
    setFormData(_formData);
  };
  useEffect(() => {
    if (!props || !props.message) props?.closeAction();
  }, [props?.message]);
  useEffect(() => {
    if (props?.inputElements) {
      let _formData = { ...formData };
      props.inputElements.forEach((element: any) => {
        if (element) {
          _formData[element.name] = element.value;
        }
      });
      setFormData(_formData);
    }
  }, [props.inputElements]);
  if (props?.message) {
    return (
      <div className="alert-box">
        <div className="flex-container">
          <div className="alert-container">
            <div className="modal-body alert-content col-flex center-main">
              <h3 className="title">{props?.title}</h3>
              <p className="description">{props?.message}</p>
              {props?.inputElements?.map((item: any) => {
                return (
                  <div className="form-group" key={item.name}>
                    {item.elmType?.toLowerCase() == "combo" ? (
                      <select
                        className="form-control"
                        name={item.name}
                        value={formData[item.name]}
                        onChange={onFormUpdate}
                      >
                        {item.comboOptions.map((option: any) => (
                          <option>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={item.inputType || "text"}
                        className="form-control"
                        placeholder={item.name}
                        name={item.name}
                        onChange={onFormUpdate}
                        value={formData[item.name]}
                      />
                    )}
                  </div>
                );
              })}
              <div
                style={{
                  marginBottom: "10px",
                  display: "flex",
                  flexDirection: "row",
                  gap: "1rem",
                }}
              >
                {props?.okBtnName && (
                  <button
                    className="btn"
                    onClick={() => {
                      props?.alertOkBtnFunc(formData);
                    }}
                  >
                    {props?.okBtnName}
                  </button>
                )}
                <button
                  className="btn"
                  onClick={() => {
                    setFormData({});
                    props?.closeAction();
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
}

export default Alert;
