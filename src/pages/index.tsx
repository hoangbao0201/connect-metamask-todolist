import { ChangeEvent, useEffect, useState } from "react";
import { useListen } from "@/hooks/useListen";
import { useMetamask } from "@/hooks/useMetamask";
import Wallet from "@/components/Wallet";

interface ActionConfirmModal {
    action: "edit" | "delete" | "create";
    id: string;
    name: string;
    address: string;
    health: number;
    strength: number;
}

interface ModalProps {
    data: ActionConfirmModal;
    title: string;
    message: string;
    onCancel: () => void;
    onConfirm: (params: ActionConfirmModal) => void;
}

type Player = {
    id: string;
    name: string;
    address: string;
    health: number;
    strength: number;
};

const HomePage = () => {
    const listen = useListen();
    const { dispatch } = useMetamask();

    const [players, setPlayers] = useState<Player[]>([]);
    const [showModal, setShowModal] = useState<ActionConfirmModal | null>(null);
    const [dataAddPlayer, setDataAddPlayer] = useState<Omit<Player, "id">>({
        name: "",
        address: "",
        health: 0,
        strength: 0,
    });

    useEffect(() => {
        const dataPlayers = localStorage.getItem("data-players");
        if (!dataPlayers) {
            const defaultPlayers: Player[] = [
                {
                    id: '1',
                    name: "Hồ Công Thành",
                    address: "0x3a9b17d2957",
                    health: 85,
                    strength: 62,
                },
                {
                    id: '2',
                    name: "Nguyễn Hoàng Bảo",
                    address: "0xcd4a533831c",
                    health: 92,
                    strength: 77,
                },
                {
                    id: '3',
                    name: "Trình Xuân Lộc",
                    address: "0xe7038f51a90",
                    health: 65,
                    strength: 55,
                },
                {
                    id: '4',
                    name: "Nguyễn Văn Duy",
                    address: "0xaf7b8b9a6c1",
                    health: 78,
                    strength: 68,
                },
                {
                    id: '5',
                    name: "Trịnh Thế Nhật",
                    address: "0x1d44cfe5579",
                    health: 90,
                    strength: 83,
                },
            ];
            localStorage.setItem("data-players", JSON.stringify(defaultPlayers));
            setPlayers(defaultPlayers);
        } else {
            setPlayers(JSON.parse(dataPlayers) || []);
        }
        if (typeof window !== undefined) {
            const ethereumProviderInjected =
                typeof window.ethereum !== "undefined";

            const isMetamaskInstalled =
                ethereumProviderInjected && Boolean(window.ethereum.isMetaMask);

            const local = window.localStorage.getItem("metamaskState");

            if (local) {
                listen();
            }

            const { wallet, balance } = local
                ? JSON.parse(local)
                : { wallet: null, balance: null };

            dispatch({
                type: "pageLoaded",
                isMetamaskInstalled,
                wallet,
                balance,
            });
        }
    }, []);

    const handleActionPlayer = (data: ActionConfirmModal) => {
        let updatedPlayers = [...players];
        const { action, ...dataAction } = data;

        if (action === "delete") {
            updatedPlayers = players.filter((player) => player.id !== data.id);
        }
        else if (action === "create") {
            updatedPlayers = [
                ...players,
                {
                    id: String(players.length + 1),
                    ...dataAddPlayer,
                },
            ];
            setDataAddPlayer({
                name: "",
                address: "",
                health: 0,
                strength: 0,
            });
        }

        setShowModal(null);
        setPlayers(updatedPlayers);
        localStorage.setItem("data-players", JSON.stringify(updatedPlayers));
    };

    const handleChangeDataAdd = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDataAddPlayer((prevData) => ({ ...prevData, [name]: value }));
    };

    return (
        <div className="py-10">
            <Wallet>
                <div>
                <div className="mb-4">
                        <div className="mb-4">
                            <label
                                htmlFor="name"
                                className="block mb-1 font-medium text-left"
                            >
                                Tên Player
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={dataAddPlayer.name}
                                placeholder="Tên Player"
                                className="border p-2 rounded w-full mb-2"
                                onChange={handleChangeDataAdd}
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="address"
                                className="block mb-1 font-medium text-left"
                            >
                                Địa chỉ Player
                            </label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={dataAddPlayer.address}
                                placeholder="Địa chỉ Player"
                                className="border p-2 rounded w-full mb-2"
                                onChange={handleChangeDataAdd}
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="health"
                                className="block mb-1 font-medium text-left"
                            >
                                Sức khỏe
                            </label>
                            <input
                                type="number"
                                id="health"
                                name="health"
                                value={dataAddPlayer.health}
                                placeholder="Sức khỏe"
                                className="border p-2 rounded w-full mb-2"
                                onChange={handleChangeDataAdd}
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="strength"
                                className="block mb-1 font-medium text-left"
                            >
                                Sức mạnh
                            </label>
                            <input
                                type="number"
                                id="strength"
                                name="strength"
                                value={dataAddPlayer.strength}
                                placeholder="Sức mạnh"
                                className="border p-2 rounded w-full mb-2"
                                onChange={handleChangeDataAdd}
                            />
                        </div>

                        <button
                            onClick={() =>
                                handleActionPlayer({
                                    action: "create",
                                    ...dataAddPlayer,
                                    id: "",
                                })
                            }
                            className="w-full bg-blue-500 text-white p-2 rounded mt-2"
                        >
                            Thêm Player
                        </button>
                    </div>
                    <h1 className="text-2xl font-bold mb-4">
                        Danh sách Player
                    </h1>
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto bg-white border-collapse shadow-md rounded-lg">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-1 py-2 text-center font-semibold text-gray-700">
                                        Id
                                    </th>
                                    <th className="px-4 py-2 text-center font-semibold text-gray-700">
                                        Tên Player
                                    </th>
                                    <th className="px-4 py-2 text-center font-semibold text-gray-700">
                                        Địa chỉ
                                    </th>
                                    <th className="px-4 py-2 text-center font-semibold text-gray-700">
                                        Sức khỏe
                                    </th>
                                    <th className="px-4 py-2 text-center font-semibold text-gray-700">
                                        Sức mạnh
                                    </th>
                                    <th className="px-4 py-2 text-center font-semibold text-gray-700">
                                        Hành động
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {players.map((player) => (
                                    <tr
                                        key={player.id}
                                        className="border-b hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-2">
                                            {player.id}
                                        </td>
                                        <td className="px-4 py-2">
                                            {player.name}
                                        </td>
                                        <td className="px-4 py-2">
                                            {player.address}
                                        </td>
                                        <td className="px-4 py-2">
                                            {player.health}
                                        </td>
                                        <td className="px-4 py-2">
                                            {player.strength}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            <button
                                                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 ml-2"
                                                onClick={() =>
                                                    setShowModal({
                                                        action: "delete",
                                                        ...player,
                                                    })
                                                }
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {showModal?.action === "delete" && (
                    <Modal
                        data={showModal}
                        title="Xóa Player"
                        onConfirm={handleActionPlayer}
                        onCancel={() => setShowModal(null)}
                        message={`Bạn muốn xóa player "${showModal?.name}"?`}
                    />
                )}
            </Wallet>
        </div>
    );
};

export default HomePage;


const Modal: React.FC<ModalProps> = ({
    data,
    title,
    message,
    onConfirm,
    onCancel,
}) => {
    const [name, setName] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [health, setHealth] = useState<number>(0);
    const [strength, setStrength] = useState<number>(0);

    useEffect(() => {
        if (data?.action === "edit") {
            setName(data?.name || "");
            setAddress(data?.address || "");
            setHealth(data?.health || 0);
            setStrength(data?.strength || 0);
        }
    }, []);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded w-[500px]">
                <h2 className="text-xl font-bold">{title}</h2>
                <p>{message}</p>

                <div className="mt-2 flex justify-end">
                    <button
                        onClick={onCancel}
                        className="bg-gray-500 text-white p-2 rounded mr-2"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={() =>
                            onConfirm({
                                ...data,
                                name,
                                address,
                                health,
                                strength,
                            })
                        }
                        className="bg-blue-500 text-white p-2 rounded"
                    >
                        {data?.action === "edit" ? "Lưu" : "Xóa"}
                    </button>
                </div>
            </div>
        </div>
    );
};
