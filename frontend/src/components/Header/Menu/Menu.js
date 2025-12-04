// import React, { useState } from "react";

// const Menu = ({ items, iconSrc }) => {
//   const [showMenu, setShowMenu] = useState(false);

//   const handleClick = (action) => {
//     if (typeof action === "function") {
//       action();
//     }
//   };

//   return (
//     <div className="menu-container">
//       <button id="menu-button" onClick={() => setShowMenu(!showMenu)}>
//         ☰
//       </button>

//       {showMenu && (
//         <div className="menu">
//           {items.map((item, index) => (
//             <button
//               key={index}
//               className="menu-item"
//               onClick={() => handleClick(item.onClick)}
//             >
//               {iconSrc && (
//                 <img
//                   src={iconSrc[index] || ""}
//                   alt={item.text}
//                   className="menu-icon"
//                 />
//               )}
//               {item.text}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Menu;

import { useState } from "react";
import "./Menu.css"; // We'll put the CSS here

const Menu = ({ items, iconSrc }) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleClick = (action) => {
    if (typeof action === "function") {
      action();
    }
  };

  return (
    <div className="menu-container">
      <button
        id="menu-button"
        className="menu-button"
        onClick={() => setShowMenu(!showMenu)}
      >
        ☰
      </button>

      {showMenu && (
        <div className="menu">
          <ul className="menu-list">
            {items.map((item, index) => (
              <li key={index} className="menu-list-item">
                <button
                  className="menu-item"
                  onClick={() => handleClick(item.onClick)}
                >
                  {iconSrc && (
                    <span className="menu-icon-wrapper">
                      <img
                        src={iconSrc[index] || ""}
                        alt={item.text}
                        className="menu-icon"
                      />
                    </span>
                  )}
                  <span className="menu-text">{item.text}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Menu;
