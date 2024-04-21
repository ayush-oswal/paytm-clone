import { SendCard } from "../../../components/SendCard";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { Center } from "@repo/ui/center";

async function getP2Ptransfers(type:string) {
    const session = await getServerSession(authOptions)
    if(type==="received"){
        const received = prisma.p2pTransfer.findMany({
            where:{
                toUserId : Number(session?.user?.id)
            }
        })
        return received;
    }
    else{
        const sent = await prisma.p2pTransfer.findMany({
            where:{
                fromUserId : Number(session?.user?.id)
            }
        })
        return sent
    }
}

const formatDate = (date: Date): string => {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${month.toString().padStart(2, '0')}/${year}`;
};

export default async function() {
    const received = await getP2Ptransfers("received")
    const sent = await getP2Ptransfers("sent")
    return (
        <div className="w-full">
            <Center>
            <SendCard />
            <div className="flex">
                <div className="flex flex-col mr-4">
                    <h2 className="text-lg font-bold">Sent</h2>
                    {sent.map((transaction, index) => (
                        <div key={index}>{`s${index + 1}:  ₹${transaction.amount/100} on(${formatDate(transaction.timestamp)}) to ${transaction.toUserId}`}</div>
                    ))}
                </div>
                <div className="flex flex-col">
                    <h2 className="text-lg font-bold">Received</h2>
                    {received.map((transaction, index) => (
                        <div key={index}>{`r${index + 1}:  ₹${transaction.amount/100} (${formatDate(transaction.timestamp)}) from ${transaction.fromUserId}`}</div>
                    ))}
                </div>
            </div>
            </Center>
        </div>
    );
}