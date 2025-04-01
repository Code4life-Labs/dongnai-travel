import React from "react";

import Icon01d from "../iconset/01d.svg";
import Icon01n from "../iconset/01n.svg";
import Icon02d from "../iconset/02d.svg";
import Icon02n from "../iconset/02n.svg";
import Icon03d from "../iconset/03d.svg";
import Icon03n from "../iconset/03n.svg";
import Icon04d from "../iconset/04d.svg";
import Icon04n from "../iconset/04n.svg";
import Icon09d from "../iconset/09d.svg";
import Icon09n from "../iconset/09n.svg";
import Icon10d from "../iconset/10d.svg";
import Icon10n from "../iconset/10n.svg";
import Icon11d from "../iconset/11d.svg";
import Icon11n from "../iconset/11n.svg";
import Icon13d from "../iconset/13d.svg";
import Icon13n from "../iconset/13n.svg";
import Icon50d from "../iconset/50d.svg";
import Icon50n from "../iconset/50n.svg";

const GetIcon = (iconName, settings) => {
  switch (iconName) {
    case "01d":
      return <Icon01d {...settings} />
    case "01n":
      return <Icon01n {...settings} />
    case "02d":
      return <Icon02d {...settings} />
    case "02n":
      return <Icon02n {...settings} />
    case "03d":
      return <Icon03d {...settings} />
    case "03n":
      return <Icon03n {...settings} />
    case "04d":
      return <Icon04d {...settings} />
    case "04n":
      return <Icon04n {...settings} />
    case "09d":
      return <Icon09d {...settings} />
    case "09n":
      return <Icon09n {...settings} />
    case "10d":
      return <Icon10d {...settings} />
    case "10n":
      return <Icon10n {...settings} />
    case "11d":
      return <Icon11d {...settings} />
    case "11n":
      return <Icon11n {...settings} />
    case "13d":
      return <Icon13d {...settings} />
    case "13n":
      return <Icon13n {...settings} />
    case "50d":
      return <Icon50d {...settings} />
    case "50n":
      return <Icon50n {...settings} />
  }
};

export default GetIcon;
