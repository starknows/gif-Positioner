<script>
    let imageSrc = null
    let isShowtime = false
    let itemArray = []
    let setBpm = 60
    let isPreviewMode = false
    function handleUpload(e) {
        const [file] = e.target.files
        if (file) {
            imageSrc = URL.createObjectURL(file)
            console.log(imageSrc)
        }
    }
    function addNewItem() {
        console.log('trigger')
        itemArray = [
            ...itemArray,
            { top: 0, left: 0, width: 100, height: 100, layer: null },
        ]
    }
    function dragItem(e) {
        e.stopPropagation()
        let index = e.target.dataset.index
        if (!index) return
        const parentSize = {
            x: e.target.parentElement.clientWidth,
            y: e.target.parentElement.clientHeight,
        }
        const itemDataCached = JSON.parse(JSON.stringify(itemArray[index]))
        const InitLeft = itemDataCached.left
        const InitTop = itemDataCached.top
        const InitClienX = e.clientX
        const InitClienY = e.clientY
        const WidthRatio =
            Math.floor((itemDataCached.width / parentSize.x) * 1000) / 10
        const HeightRatio =
            Math.floor((itemDataCached.height / parentSize.y) * 1000) / 10
        document.onmousemove = (moveEvent) => {
            const fixX =
                Math.floor(
                    ((moveEvent.clientX - InitClienX) / parentSize.x) * 1000
                ) / 10
            const fixY =
                Math.floor(
                    ((moveEvent.clientY - InitClienY) / parentSize.y) * 1000
                ) / 10
            itemArray[index].left = InitLeft + fixX
            itemArray[index].top = InitTop + fixY
            if (itemArray[index].left + WidthRatio > 100)
                itemArray[index].left = 100 - WidthRatio
            if (itemArray[index].left < 0) itemArray[index].left = 0
            if (itemArray[index].top + HeightRatio > 100)
                itemArray[index].top = 100 - HeightRatio
            if (itemArray[index].top < 0) itemArray[index].top = 0
        }
        let clearMoveEvent = () => {
            document.onmousemove = null
            document.removeEventListener('mouseup', clearMoveEvent)
        }
        document.addEventListener('mouseup', clearMoveEvent)
    }
    function adjustItem(e, type, index) {
        console.log(type, index)
        e.stopPropagation()
        switch (type) {
            case 'plus':
                itemArray[index].width += 20
                itemArray[index].height += 20
                if (itemArray[index].width > 800) itemArray[index].width = 800
                if (itemArray[index].height > 800) itemArray[index].height = 800
                break
            case 'minus':
                itemArray[index].width -= 20
                itemArray[index].height -= 20
                if (itemArray[index].width < 100) itemArray[index].width = 100
                if (itemArray[index].height < 100) itemArray[index].height = 100
                break
            case 'remove':
                console.log('trigger')
                itemArray.splice(index, 1)
                itemArray = [...itemArray]
                break
            default:
                break
        }
    }
    function startTheShow() {
        if (!imageSrc) {
            alert('請上傳GIF!')
            return
        }
        if (itemArray.length < 1) {
            alert('請新增GIF區塊!')
            return
        }
        isShowtime = true
    }
    function requestFullScreen() {
        if (isPreviewMode) {
            document.exitFullscreen()
        } else {
            let elem = document.getElementById('setting-wrapper')
            if (elem.requestFullscreen) {
                elem.requestFullscreen()
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen()
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen()
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen()
            }
        }
        isPreviewMode = !isPreviewMode
    }
</script>

<main class="flex-center">
    {#if !isShowtime}
        <div class="control-wrapper flex-center flex-col space-between">
            <div class="control-area card flex-center flex-col">
                <h3>選擇圖片</h3>
                <input
                    type="file"
                    accept="image/gif"
                    on:change={handleUpload}
                />
                <div class="contror-preview flex-center">
                    <p>預覽圖：</p>
                    <img src={imageSrc} alt="" />
                </div>
            </div>
            <div class="button-wrapper card flex-center flex-col">
                <div class="bpm-wrapper flex-center">
                    <label for="input-bpm">BPM：</label>
                    <input
                        id="input-bpm"
                        type="number"
                        value={setBpm}
                        min="60"
                        max="240"
                        on:input={(e) => (setBpm = e.target.value)}
                    />
                </div>
                <button class="button-82-pushable" on:click={startTheShow}>
                    <span class="button-82-shadow" />
                    <span class="button-82-edge" />
                    <span class="button-82-front text"> 開始你的表演 </span>
                </button>
                <span> tip: 表演狀態時，點擊畫面四角即可返回 </span>
                <span> tip2: 建議使用 1秒1完整動作 的GIF </span>
            </div>
            <div class="author-wrapper card flex-center flex-col">
                <p>Author: starknows</p>
                <p>Email: starknows99@gmail.com</p>
            </div>
        </div>
        <div
            id="setting-wrapper"
            class={`layout-setting ${isPreviewMode ? 'preview' : 'card'}`}
        >
            <div class="add-item flex-center">
                <button class="flex-center" on:click={addNewItem}
                    ><span class="material-symbols-outlined">
                        library_add
                    </span>&ensp;新增區塊</button
                >
                <button class="flex-center" on:click={() => (itemArray = [])}
                    ><span class="material-symbols-outlined">
                        delete
                    </span>&ensp;清除區塊</button
                >
                <button class="flex-center" on:click={requestFullScreen}>
                    {#if isPreviewMode}
                        <span class="material-symbols-outlined">
                            close_fullscreen
                        </span>
                        <span>&ensp;關閉</span>
                    {:else}
                        <span class="material-symbols-outlined">
                            open_with
                        </span>
                        <span>&ensp;全螢幕</span>
                    {/if}
                </button>
            </div>
            {#each itemArray as item, i}
                <div
                    class="item-unit"
                    style={`width:${item.width}px;height:${item.height}px;left:${item.left}%;top:${item.top}%;`}
                    data-index={i}
                    on:mousedown={dragItem}
                >
                    <span
                        class="material-symbols-outlined icon-close"
                        on:click={(e) => adjustItem(e, 'remove', i)}
                    >
                        close
                    </span>
                    <div class="scale-icon-wrapper flex-center flex-col">
                        <span
                            class="material-symbols-outlined"
                            on:click={(e) => adjustItem(e, 'plus', i)}
                        >
                            add
                        </span>
                        <span
                            class="material-symbols-outlined"
                            on:click={(e) => adjustItem(e, 'minus', i)}
                        >
                            remove
                        </span>
                    </div>
                </div>
            {/each}
        </div>
    {:else}
        <div class="stage-wrapper">
            <div
                class="back-to-setting left top"
                on:click={() => (isShowtime = false)}
                on:keypress={() => (isShowtime = false)}
            />
            <div
                class="back-to-setting left bottom"
                on:click={() => (isShowtime = false)}
                on:keypress={() => (isShowtime = false)}
            />
            <div
                class="back-to-setting right top"
                on:click={() => (isShowtime = false)}
                on:keypress={() => (isShowtime = false)}
            />
            <div
                class="back-to-setting right bottom"
                on:click={() => (isShowtime = false)}
                on:keypress={() => (isShowtime = false)}
            />
            {#each itemArray as item, i}
                <div
                    class="render-unit"
                    style={`width:${item.width}px;height:${item.height}px;left:${item.left}%;top:${item.top}%;`}
                >
                    <gif-player src={imageSrc} speed={setBpm / 60} play />
                </div>
            {/each}
        </div>
    {/if}
</main>

<style lang="sass">
main
	background: 00000000
	width: 100%
	height: 100%
	display: flex
.card
	min-width: 200px
	min-height: 200px
	padding: 24px
	margin: 24px
	border-radius: 12px
	box-shadow: rgba(0, 0, 0, 0.3) 1px 2px 6px
.control-wrapper
	flex: 1 1 20% 
	margin: 16px
.control-area
	width: 100%
	height: 300px
	& > h3
		flex: 0 0 20%
	& > input
		flex: 0 0 20%
.contror-preview
	flex: 0 0 60%
	& > img
		width: 100px
		height: 100px
		object-fit: contain
.button-wrapper
	width: 100%
	height: 50%
	& > span
		font-size: 14px
		font-weight: 700
		color: rgba(black, 0.6)
.stage-wrapper
	position: relative
	width: 100%
	height: 100%
.back-to-setting
	position: absolute
	width: 50px
	height: 50px
	&.left
		left: 0
	&.right
		right: 0
	&.top
		top: 0
	&.bottom
		bottom: 0
.layout-setting
	flex: 1 1 70%
	position: relative
	width: 1440px
	height: 810px
	&.preview
		position: absolute
		z-index: 100
		top: 0
		left: 0
		width: 100%
		height: 100%
		background: white
		& > .add-item
			top: 16px
.add-item
	position: absolute
	left: 16px
	top: -48px
	& > button
		margin-right: 8px
.item-unit
	cursor: grab
	position: absolute
	border-radius: 8px
	border: 1px dashed #aaa
	background: rgba(pink, 0.1)
	&:active
		cursor: grabbing
.render-unit
	position: absolute
	pointer-events: none
gif-player
	width: 100%!important
	height: 100%!important
.icon-close
	user-select: none
	position: absolute
	right: 4px
	top: 4px
	cursor: pointer
.scale-icon-wrapper
	position: absolute
	left: 4px
	top: 4px
	& > span
		user-select: none
		cursor: pointer
.bpm-wrapper
	width: 100px
	& > input
		width: 70px
.author-wrapper
	width: 100%
button
	user-select: none
</style>
