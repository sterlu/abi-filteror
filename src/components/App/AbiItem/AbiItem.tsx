import React from 'react';

import './AbiItem.scss';
import {AbiDefinition, DataItem, EventAbi, MethodAbi} from "ethereum-types";

const Keyword = ({children}: { children: any }) => <span className="keyword">{children}</span>;

const Type = ({children}: { children: any }) => <span className="type">{children}</span>;
const Name = ({children}: { children: any }) => <span className="name">{children}</span>;

const ArgType = ({children}: { children: any }) => <span className="argtype">{children}</span>;
const ArgName = ({children}: { children: any }) => <span className="argname">{children}</span>;

const ArgsList = ({argsList}: { argsList: DataItem[] }) => <>
    {argsList.map((input, i) => (
        <>
            <ArgType>{input.type}</ArgType>
            {input.name && <ArgName> {input.name}</ArgName>}
            {i !== argsList.length - 1 && ', '}
        </>
    ))}
</>

const AbiItem = ({abiItem}: { abiItem: AbiDefinition }) => {
    if (abiItem.type === 'function') return (<AbiFunctionItem abiItem={abiItem as MethodAbi}/>)
    if (abiItem.type === 'event') return (<AbiEventItem abiItem={abiItem as EventAbi}/>)

    return (
        <span className="abi-item-wrapper">
            <b>{abiItem.type}</b> {"name" in abiItem ? abiItem.name : ''}
        </span>
    );
};

const AbiFunctionItem = ({abiItem}: { abiItem: MethodAbi }) => {
    return (
        <span className="abi-item-wrapper">
            <Type>{abiItem.type}</Type>
            <Name> {abiItem.name}</Name>
            (<ArgsList argsList={abiItem.inputs}/>)
            {abiItem.constant ? ' view' : ''}
            {abiItem.stateMutability && <Keyword> {abiItem.stateMutability}</Keyword>}
            <Keyword>{' returns '}</Keyword>
            (<ArgsList argsList={abiItem.outputs}/>)
        </span>
    );
};

const AbiEventItem = ({abiItem}: { abiItem: EventAbi }) => {
    return (
        <span className="abi-item-wrapper">
            <Type>{abiItem.type}</Type>
            <Name> {abiItem.name}</Name>
            (<ArgsList argsList={abiItem.inputs}/>)
        </span>
    );
};

export default AbiItem;
