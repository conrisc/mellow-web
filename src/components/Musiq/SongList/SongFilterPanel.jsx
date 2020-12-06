import React, {useRef} from 'react';
import { Row, Col, Button, Input, InputNumber, Select } from 'antd';
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
        <Row>
            <Col>
                <Button onClick={props.showTagsDrawer}>
                    <i className="fas fa-tags"></i>
                </Button>
            </Col>
            <Col span={8}>
                <Input
                    placeholder="Search song"
                    allowClear={true}
                    value={props.titleFilter}
                    onChange={handleTitleFilterChange}
                />
            </Col>
            <Col span={4}>
                Skip
                <InputNumber
                    value={props.skip}
                    onChange={updateSkip}
                    min={0}
                />
            </Col>
            <Col span={4}>
                Limit
                <Select
                    value={props.limit}
                    onChange={v => props.setLimit(Number(v))}>
                    <Option value={10}>10</Option>
                    <Option value={30}>30</Option>
                    <Option value={50}>50</Option>
                </Select>
            </Col>
            <Col span={4}>
                Sort
                <Select
                    value={props.sort}
                    onChange={updateSort}>
                    <Option value="none">None</Option>
                    <Option value="title_asc">Title Asc</Option>
                    <Option value="title_desc">Title Desc</Option>
                    <Option value="random">Random</Option>
                </Select>
            </Col>
            <Col>
                <Button onClick={props.showNewSongModal}>
                    <i className="fas fa-plus"></i>
                </Button>
            </Col>
        </Row>
    );
}
