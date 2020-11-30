import React, {useRef} from 'react';
import { Button, Input, InputNumber, Select } from 'antd';
const { Option } = Select;

export function SongFilterPanel(props) {
    const serachSongsInputRef = useRef();


    function handleTitleFilterChange(event) {
        handleTitleChange(event.target.value)
    }

    function clearSearchSongsInput() {
        handleTitleChange('');
        serachSongsInputRef.current.focus();
    }

    function handleTitleChange(title) {
        props.setSkip(0);
        props.setTitleFilter(title);
        props.getSongsDebounced();
    }

    function updateSkip(value) {
        props.setSkip(Number(value));
        props.getSongsDebounced();
    }

    function updateSort(value) {
        props.setSkip(0);
        props.setSort(value);
        props.getSongsDebounced();
    }

    return (
        <div className="row mt-1">
            <div className="col">
                <Button onClick={props.showTagsDrawer}>
                    <i className="fas fa-tags"></i>
                </Button>
            </div>
            <div className="col s4">
                <Input
                    placeholder="Search song"
                    allowClear={true}
                    value={props.titleFilter}
                    onChange={handleTitleFilterChange}
                />
            </div>
            <div className="col s2">
                Skip
                <InputNumber
                    value={props.skip}
                    onChange={updateSkip}
                    min={0}
                />
            </div>
            <div className="col s2">
                Limit
                <Select
                    value={props.limit}
                    onChange={v => props.setLimit(Number(v))}>
                    <Option value={10}>10</Option>
                    <Option value={30}>30</Option>
                    <Option value={50}>50</Option>
                </Select>
            </div>
            <div className="col s2">
                Sort
                <Select
                    value={props.sort}
                    onChange={updateSort}>
                    <Option value="none">None</Option>
                    <Option value="title_asc">Title Asc</Option>
                    <Option value="title_desc">Title Desc</Option>
                    <Option value="random">Random</Option>
                </Select>
            </div>
            <div className="col">
                <Button onClick={props.showNewSongModal}>
                    <i className="fas fa-plus"></i>
                </Button>
            </div>
        </div>
    );
}
