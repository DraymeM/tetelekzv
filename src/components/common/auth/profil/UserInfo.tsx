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
  <div className="flex flex-col justify-center items-center h-full min-h-[60vh] p-8 ml-0">
    <div className="flex items-center space-x-6 p-6 rounded-2xl shadow-xl mb-6">
      <FiUser
        size={100}
        className="text-foreground bg-secondary p-2 rounded-full"
      />
      <div>
        <p className="text-4xl font-bold mb-5 text-center justify-center">
          {isAuthenticated ? username : "Nincs felhasználói név"}
        </p>
        <span
          className={`inline-block mt-2 px-3 py-1 text-lg font-semibold rounded-full text-white ${
            isSuperUser ? "bg-red-500" : "bg-teal-500"
          }`}
        >
          {isSuperUser ? "Szuperfelhasználó" : "Felhasználó"}
        </span>
      </div>
    </div>

    <button
      className="w-auto px-4 py-2 text-xl text-white font-bold hover:bg-red-800 hover:cursor-pointer bg-red-700 rounded transition-colors flex items-center gap-2"
      onClick={onLogout}
    >
      <FiLogOut size={20} />
      Kijelentkezés
    </button>
  </div>
);

export default UserInfo;
