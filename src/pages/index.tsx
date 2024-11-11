import { useEffect, useState } from "react";
import { useListen } from "@/hooks/useListen";
import { useMetamask } from "@/hooks/useMetamask";
import Wallet from "@/components/Wallet";

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
    return (
        <div className="py-10">
            <Wallet>
                <div>
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
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Wallet>
        </div>
    );
};

export default HomePage;
