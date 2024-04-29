<div className='grid grid-cols-12'>
<div className='col-span-12'>
    <div className='productTableSubContainer'>
        <div className='h-full grid grid-cols-12'>
            <div className='h-full mobile:col-span-10 tablet1:col-span-10 tablet:col-span-7 laptop:col-span-7 desktop1:col-span-7 desktop2:col-span-7'>
                <div className='grid grid-cols-12 pl-6 g h-full'>
                    {menuCategory.map((menu, index) => (
                        <div
                            key={index}
                            className={`flex col-span-3 justify-center ${tab === index ? 'productTabAll' : 'productTab'}`}
                            onClick={() => {
                                setTab(index);
                                setSearchWord('');
                                setDataSearch([]);
                                setMenuId(menu.menuCategoryId);
                                getAllItems(menu.menuCategoryId);
                            }}
                        >
                            <div className='statusTabtext'>{menu.menuCategoryName}</div>
                            &nbsp;&nbsp;
                            <div className={`ProductCount ${tab === index ? 'blueCount' : ''}`}>
                                {countData && countData.allProduct ? countData.allProduct : 0}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className='flex col-span-6 gap-4 col-start-11 pr-3  h-full'>
                <div className='self-center justify-self-end'>
                    <button className='addProductBtn' onClick={handleOpen}>Add Product</button>
                </div>
            </div>
        </div>
    </div>
</div>

</div>