import { FiUser, FiLogOut } from "react-icons/fi";

interface UserInfoProps {
  username: string;
  isSuperUser: boolean;
  isAuthenticated: boolean;
  onLogout: () => void;
}

const UserInfo = ({
  username,
  isSuperUser,
  isAuthenticated,
  onLogout,
}: UserInfoProps) => (
  <div className="flex flex-col justify-center items-center h-full min-h-[50dvh] mx-auto max-w-[95dvw] md:max-w-md  px-4">
    <div className="flex items-center space-x-6 p-6 rounded-2xl shadow-xl mb-6 w-full">
      <FiUser className="text-foreground bg-secondary md:w-30 md:h-30 w-25 h-25 p-2 rounded-full" />
      <div>
        <p className="md:text-4xl text-2xl font-bold mb-5 text-center">
          {isAuthenticated ? username : "Nincs felhasználói név"}
        </p>
        <span
          className={`inline-block mt-2 px-3 py-1 md:text-lg text-base font-semibold rounded-full text-white ${
            isSuperUser ? "bg-red-500" : "bg-teal-500"
          }`}
        >
          {isSuperUser ? "Admin" : "User"}
        </span>
      </div>
    </div>

    <button
      className="px-4 py-2 text-xl text-white font-bold hover:bg-red-800 hover:cursor-pointer bg-red-700 rounded transition-colors flex items-center gap-2"
      onClick={onLogout}
    >
      <FiLogOut size={20} />
      Kijelentkezés
    </button>
  </div>
);

export default UserInfo;
