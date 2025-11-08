'use client'

import React from 'react'
import BookCard  from './components/bookingCard'

const ProductsPageClient = () => {

    const booksData = [{
        id: "1",
        title: "Thần Thánh Việt Nam",
        subtitle: "Tuyển tập truyện cổ tích dân gian",
        author: "Tác giả tập thể",
        description:
            "Bộ sưu tập những câu chuyện thần thoại và truyền thuyết Việt Nam được kể lại một cách sinh động, mang đậm bản sắc văn hóa dân tộc. Từ những vị thần linh thiêng đến các anh hùng dân tộc, mỗi câu chuyện đều chứa đựng những bài học quý giá về lòng yêu nước, tình người và truyền thống tốt đẹp.",
        features: [
            "Hơn 50 câu chuyện thần thoại và truyền thuyết",
            "Minh họa màu sắc sinh động",
            "Ngôn ngữ dễ hiểu, phù hợp mọi lứa tuổi",
            "Bìa cứng cao cấp, in trên giấy mỹ thuật",
            "Kèm theo bản đồ các địa danh trong truyện",
        ],
        coverImage: "/vietnamese-mythology-book-cover-with-traditional-d.jpg",
        galleryImages: ["/vietnamese-traditional-art-illustration.jpg", "/ancient-vietnamese-temple-scene.jpg"],
        price: 299000,
        originalPrice: 399000,
        category: "Văn học dân gian",
        publishDate: "2024-03-15",
        isbn: "978-604-1-23456-7",
        pages: 320,
        language: "Tiếng Việt",
        publisher: "NXB Thế Vũ",
        preOrderDeadline: "31/12/2024",
        specialOffers: [
            "Tặng kèm bookmark đặc biệt",
            "Miễn phí vận chuyển toàn quốc",
            "Ký tặng của tác giả (số lượng có hạn)",
        ],
    },
    {
        id: "2",
        title: "Đại Việt Ký Nhân Quyền",
        subtitle: "Hồ sơ bí mật về các anh hùng dân tộc",
        author: "Nguyễn Văn Sử",
        description:
            "Cuốn sách khám phá những câu chuyện chưa được kể về các anh hùng dân tộc Việt Nam qua các triều đại. Với góc nhìn mới mẻ và tư liệu quý hiếm, tác phẩm mang đến cái nhìn sâu sắc về lịch sử và con người Việt Nam.",
        features: [
            "Tư liệu lịch sử quý hiếm được công bố lần đầu",
            "Hình ảnh và bản đồ cổ được phục chế",
            "Phân tích chuyên sâu từ các sử gia uy tín",
            "Bìa cứng sang trọng với chất liệu cao cấp",
            "Kèm theo CD audio kể chuyện",
        ],
        coverImage: "/historical-vietnamese-book-cover-with-ancient-scro.jpg",
        galleryImages: ["/ancient-vietnamese-manuscript.jpg", "/historical-vietnamese-battle-scene.jpg"],
        price: 450000,
        originalPrice: 550000,
        category: "Lịch sử",
        publishDate: "2024-04-20",
        isbn: "978-604-1-23457-8",
        pages: 480,
        language: "Tiếng Việt",
        publisher: "NXB Thế Vũ",
        preOrderDeadline: "15/01/2025",
        specialOffers: ["Tặng kèm bản đồ lịch sử Việt Nam", "Giảm 20% cho đơn hàng từ 2 cuốn", "Bao bì quà tặng cao cấp"],
    },
    {
        id: "3",
        title: "Huyền Thoại Rồng Việt",
        subtitle: "Những câu chuyện về linh vật thiêng",
        author: "Lê Minh Đức",
        description:
            "Khám phá những câu chuyện huyền bí về rồng trong văn hóa Việt Nam. Từ Lạc Long Quân đến các truyền thuyết về rồng nước, cuốn sách mang đến cái nhìn sâu sắc về biểu tượng thiêng liêng này trong tâm thức dân tộc.",
        features: [
            "Tập hợp 30+ truyền thuyết về rồng Việt",
            "Tranh minh họa độc đáo theo phong cách cổ điển",
            "Phân tích ý nghĩa văn hóa và tâm linh",
            "Bìa áo jacket cao cấp với hiệu ứng hologram",
            "Kèm theo poster rồng Việt khổ lớn",
        ],
        coverImage: "/vietnamese-dragon-mythology-book-cover.jpg",
        galleryImages: ["/vietnamese-dragon-art.jpg", "/ancient-dragon-temple.jpg"],
        price: 350000,
        originalPrice: 450000,
        category: "Thần thoại",
        publishDate: "2024-05-10",
        isbn: "978-604-1-23458-9",
        pages: 280,
        language: "Tiếng Việt",
        publisher: "NXB Thế Vũ",
        preOrderDeadline: "28/02/2025",
        specialOffers: [
            "Tặng kèm móc khóa rồng vàng",
            "Ưu đãi combo 3 cuốn giảm 30%",
            "Chữ ký tác giả kèm lời chúc cá nhân",
        ],
    },
    {
        id: "4",
        title: "Cung Đình Huế Xưa",
        subtitle: "Bí mật hoàng cung triều Nguyễn",
        author: "Phạm Thị Lan Hương",
        description:
            "Cuốn sách tiết lộ những câu chuyện chưa từng được kể về cuộc sống trong cung đình Huế thời các vua triều Nguyễn. Từ nghi lễ cung đình đến đời sống hàng ngày của hoàng gia, tất cả được tái hiện một cách chân thực và sinh động.",
        features: [
            "Hình ảnh hiếm về cung đình Huế được số hóa",
            "Tái hiện nghi lễ và trang phục cung đình",
            "Phỏng vấn độc quyền với hậu duệ hoàng gia",
            "Bìa cứng phủ vàng theo phong cách hoàng gia",
            "Tặng kèm bộ postcard cung đình Huế",
        ],
        coverImage: "/hue-imperial-palace-book-cover.jpg",
        galleryImages: ["/hue-palace-interior.jpg", "/royal-costume-display.jpg"],
        price: 520000,
        originalPrice: 650000,
        category: "Lịch sử cung đình",
        publishDate: "2024-06-01",
        isbn: "978-604-1-23459-0",
        pages: 420,
        language: "Tiếng Việt",
        publisher: "NXB Thế Vũ",
        preOrderDeadline: "31/03/2025",
        specialOffers: [
            "Tặng kèm quạt cung đình mini",
            "Miễn phí giao hàng express",
            "Bao bì quà tặng phong cách hoàng gia",
        ],
    },]

    return (
        <>
            <section className="vietnamese-pattern py-20 relative">
                <div className="container mx-auto px-4 text-center">
                    <div className="animate-fade-in-up">
                        <h1 className="text-5xl md:text-7xl font-bold text-holder mb-8 leading-tight">
                            Khám Phá Kho Tàng
                            <span className="text-primary block">Văn Hóa Việt Nam</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-holder text-pretty max-w-3xl mx-auto mb-12 leading-relaxed">
                            Những cuốn sách quý giá về lịch sử, văn hóa và truyền thống Việt Nam.
                            <span className="text-primary font-medium"> Đặt trước ngay hôm nay</span> để không bỏ lỡ cơ hội sở hữu
                            những tác phẩm độc đáo.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <div className="flex items-center gap-2 text-sm text-holder">
                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                                <span>Miễn phí vận chuyển toàn quốc</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-holder">
                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                                <span>Ưu đãi đặc biệt cho khách hàng đặt trước</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute top-10 left-10 w-20 h-20 border border-primary/20 rounded-full animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-16 h-16 border border-primary/30 rounded-full animate-pulse delay-1000"></div>
            </section>

            <section className="py-24 relative">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 animate-fade-in-up">
                        <h2 className="text-4xl md:text-5xl font-bold text-holder text-balance mb-6">Sách Mới Phát Hành</h2>
                        <p className="text-lg text-holder text-pretty max-w-2xl mx-auto leading-relaxed">
                            Những cuốn sách được chờ đợi nhất năm 2024, hiện đang mở đặt trước với nhiều ưu đãi hấp dẫn.
                        </p>
                        <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-6 rounded-full"></div>
                    </div>

                    <div className="books-grid px-4">
                        {booksData.map((book, index) => (
                            <div key={book.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                                <BookCard book={book} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}

export default ProductsPageClient