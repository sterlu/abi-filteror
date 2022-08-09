import React, {useCallback, useRef, useState} from 'react';
import './App.scss';
import {useActionWithLoading} from "../../utils/hooks";
import {AbiDefinition, ContractAbi} from "ethereum-types";
import AbiItem from "./AbiItem/AbiItem";
import {getAbi} from "../../utils/abi";
import {getEtherscanLink, Network} from "../../utils/general";

function App() {
    const inputEl = useRef<HTMLInputElement>(null);
    const [abi, setAbi] = useState<ContractAbi>([]);
    const [network, setNetwork] = useState<Network>(1);
    const [checks, setChecks] = useState<boolean[]>([]);

    const {
        action: submit, error, loading,
    } = useActionWithLoading(async (network: Network) => {
        const address = inputEl.current?.value;
        if (!address || !(new RegExp(/0x[0-9A-Za-z]{40}/)).test(address)) {
            throw new Error('Invalid contract address');
        }
        const abi = await getAbi(address, network);
        setNetwork(network);
        setAbi(abi);
        setChecks((new Array(abi.length)).map(() => false));
    })

    const toggle = useCallback((i:number) => {
        const _checks = [...checks];
        _checks[i] = !_checks[i];
        setChecks(_checks);
    }, [checks]);

    const toggleSpecial = useCallback((changer: Function) => () => {
        const _checks = [...checks];
        abi.forEach((abiItem, i) => changer(abiItem, _checks, i))
        setChecks(_checks);
    }, [abi, checks]);

    const selectAll = toggleSpecial((abiItem:AbiDefinition, checks:boolean[], i:number) => checks[i] = true);
    const deselectAll = toggleSpecial((abiItem:AbiDefinition, checks:boolean[], i:number) => checks[i] = false);
    const selectAllFunctions = toggleSpecial((abiItem:AbiDefinition, checks:boolean[], i:number) => abiItem.type === 'function' && (checks[i] = true));

    const copyAbi = useCallback(() => {
        const _abi:any = [];
        checks.forEach((checked, i) => {
            if (checked) _abi.push(abi[i]);
        });
        navigator.clipboard.writeText(JSON.stringify(_abi));
    }, [abi, checks])

    return (
        <div className="App">
            <div>
                <input
                    ref={inputEl}
                    type="text"
                    size={42}
                    placeholder="Contract address"
                    autoFocus
                    // defaultValue="0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9"
                    // defaultValue="0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413"
                />
                <button onClick={() => submit(1)}>Mainnet ABI</button>
                <button onClick={() => submit(10)}>Optimism ABI</button>
                <button onClick={() => submit(42161)}>Arbitrum ABI</button>
                {loading && <span className="loader">...</span>}
                {error && <span className="error">{error}</span>}
            </div>
            {abi.length > 0 && (
                <>
                    <div>
                        <button onClick={selectAll}>Select All</button>
                        <button onClick={deselectAll}>Deselect All</button>
                        <button onClick={selectAllFunctions}>Select All Functions</button>
                        <a href={getEtherscanLink(inputEl.current?.value || '', 'address', network)} target="_blank">Etherscan</a>
                        |
                        <button onClick={() => copyAbi()}>Copy Filtered ABI</button>
                    </div>
                    <ul>
                        {abi.map((abiItem, i) => (
                            <li onClick={() => toggle(i)}>
                                <input type="checkbox" checked={checks[i]} />
                                <AbiItem abiItem={abiItem} />
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}

export default App;
