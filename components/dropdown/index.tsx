import Avatar from "components/avatar";
import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressCard, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useOnClickOutside } from "hooks/react-click-outside";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";

const DropDown = () => {
  const ref = useRef<any>();
  const [drop, setDrop] = useState(false);
  const [, , removeCookies] = useCookies();
  const router = useRouter();
  useOnClickOutside(ref, () => {
    setDrop(false);
  });

  const handleLogout = () => {
    removeCookies("id", { path: "/" });
    router.replace("/");
  };

  const r2Profile = () => {
    router.push("/profile");
  };
  return (
    <div className="relative" ref={ref}>
      <Avatar size={"sm"} onClick={(e) => setDrop(true)} />
      {drop && (
        <div className="absolute w-200 right-0 flex-col flex bg-white shadow rounded w-32 text-gray-500 text-sm text-semibold overflow-hidden">
          <div
            onClick={e => handleLogout()}
            className="w-full p-2 border-b border-gray-100 cursor-pointer hover:bg-yellow-600 hover:text-yellow-50"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
            Đăng xuất
          </div>
          <div
            onClick={r2Profile}
            className="w-full p-2 border-gray-100 cursor-pointer hover:bg-yellow-600 hover:text-yellow-50"
          >
            <FontAwesomeIcon icon={faAddressCard} className="mr-2" />
            Profile
          </div>
        </div>
      )}
    </div>
  );
};

export default DropDown;
